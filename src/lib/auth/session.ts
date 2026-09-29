import { cookies } from "next/headers";
import type { StaffRole } from "./roles";

export { staffRoleLabel, type StaffRole } from "./roles";

export const SESSION_COOKIE_NAME = "lc_admin_token";

export interface StaffClaims {
  sub: string;
  email: string;
  role: StaffRole;
}

/**
 * Decodes (never verifies - the backend's `JwtAuthGuard` is the source of truth for that) the
 * JWT payload, purely so server components can render "Signed in as ...". A malformed or expired
 * token still fails every real API call; this is display-only.
 */
function decodeClaims(token: string): StaffClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    const parsed = JSON.parse(json) as Partial<StaffClaims>;
    if (!parsed.sub || !parsed.email || !parsed.role) return null;
    return { sub: parsed.sub, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

export interface StaffSession {
  token: string;
  claims: StaffClaims;
}

export async function getSession(): Promise<StaffSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const claims = decodeClaims(token);
  if (!claims) return null;

  return { token, claims };
}
