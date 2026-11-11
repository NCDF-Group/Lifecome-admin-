/** Public configuration only. Never place credentials in browserConfig(). */

export interface PortalConfig {
  professionalOrigin: string | null;
  patientAppUrl: string | null;
}

type Env = Record<string, string | undefined>;

function safeUrl(value: string | undefined, name: string, originOnly = false): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.hash || url.search) {
    throw new Error(`${name} must be an http(s) URL without credentials, query or fragment.`);
  }
  if (originOnly && url.pathname !== "/") throw new Error(`${name} must be an origin without a path.`);
  return originOnly ? url.origin : url.href.replace(/\/?$/, "/");
}

export function readConfig(env: Env = process.env): PortalConfig {
  return Object.freeze({
    professionalOrigin: safeUrl(env.APP_ORIGIN, "APP_ORIGIN", true),
    patientAppUrl: safeUrl(env.PATIENT_APP_URL, "PATIENT_APP_URL"),
  });
}

/** Script served at /runtime-config.js. Local defaults resolve in the browser so proxies and containers just work. */
export function browserConfig(config: PortalConfig): string {
  const json = JSON.stringify(config)
    .replaceAll("<", "\\u003c")
    .replaceAll(" ", "\\u2028")
    .replaceAll(" ", "\\u2029");
  return `(() => { const config = ${json}; window.LIFECOME_CONFIG = Object.freeze({
  demoOnly: true,
  professionalOrigin: config.professionalOrigin || window.location.origin,
  patientAppUrl: config.patientAppUrl || window.location.origin + '/patient/'
}); })();`;
}
