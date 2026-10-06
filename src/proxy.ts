import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Duplicated from lib/auth/session.ts on purpose: proxy code shouldn't rely on shared modules
// (that file also imports `next/headers`).
const SESSION_COOKIE_NAME = "lc_admin_token";

function roleFromToken(token: string | undefined): string | null {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return (JSON.parse(json) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

/**
 * Keeps clinicians out of the admin pages (and everyone else out of the clinician workspace)
 * *before* a page renders, so nobody lands on a 403 error screen. Display-level only: the token's
 * role is decoded, not verified. The backend's `RolesGuard` is what actually refuses a clinician
 * every admin endpoint.
 */
export function proxy(request: NextRequest) {
  const role = roleFromToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!role) return NextResponse.next(); // signed out: the console layout sends them to /login

  const { pathname } = request.nextUrl;
  const inWorkspace = pathname === "/workspace" || pathname.startsWith("/workspace/");
  const clinicianMayOpen = inWorkspace || pathname.startsWith("/profile");

  if (role === "clinician" && !clinicianMayOpen) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }
  if (role !== "clinician" && inWorkspace) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Pages only: skip the API routes, Next internals, the login page and static files.
  matcher: ["/((?!api|_next|login|.*\\..*).*)"],
};
