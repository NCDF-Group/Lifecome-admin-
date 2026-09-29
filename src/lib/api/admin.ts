import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { apiFetch, ApiError } from "./client";

/**
 * The call every feature's `api.ts` uses for a guarded `/admin/...` endpoint: attaches the
 * signed-in staff member's bearer token, and sends them back to `/login` if there's no session or
 * the backend rejects the token (expired, revoked). Server-component only - see `lib/auth/session.ts`.
 */
export async function adminFetch<TResponse = unknown>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const session = await getSession();
  if (!session) redirect("/login");

  try {
    return await apiFetch<TResponse>(path, { ...init, token: session.token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    throw error;
  }
}

export { ApiError } from "./client";
