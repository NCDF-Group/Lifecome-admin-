export const inputClass =
  "rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30 disabled:cursor-not-allowed disabled:opacity-70";

export const submitClass =
  "self-start rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-60";

/** Sends a JSON body to one of this app's `/api/profile*` routes; returns the error message, if any. */
export async function sendProfileRequest(
  url: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body: unknown,
  fallbackError: string,
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.ok) return null;
    const data = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
    return data?.error ?? fallbackError;
  } catch {
    return "Could not reach the server. Try again.";
  }
}
