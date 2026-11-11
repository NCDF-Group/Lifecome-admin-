import { NextResponse, type NextRequest } from "next/server";
import { AuthError, SESSION_COOKIE, userForToken, type SessionUser } from "./auth/core.ts";
import type { RoleKey } from "./roles.ts";

export function json(data: unknown, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function origin(req: NextRequest): string {
  return process.env.APP_ORIGIN || req.nextUrl.origin;
}

/** Blocks cross-site state changes: the Origin header must match this host. */
function assertSameOrigin(req: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const source = req.headers.get("origin");
  if (source && new URL(source).host !== req.headers.get("host")) throw new AuthError("Cross-site request blocked.", 403);
}

export async function body<T = Record<string, unknown>>(req: NextRequest): Promise<T> {
  try {
    const data = await req.json();
    if (data && typeof data === "object") return data as T;
  } catch {}
  throw new AuthError("Send a JSON body.", 400);
}

export function userFromRequest(req: NextRequest): SessionUser | null {
  return userForToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export function requireApiUser(req: NextRequest, roles?: RoleKey[]): SessionUser {
  const user = userFromRequest(req);
  if (!user) throw new AuthError("Sign in to continue.", 401);
  if (roles && !roles.includes(user.role)) throw new AuthError("You don’t have access to this.", 403);
  return user;
}

export function route<Ctx = unknown>(handler: (req: NextRequest, ctx: Ctx) => Promise<Response> | Response) {
  return async (req: NextRequest, ctx: Ctx) => {
    try {
      assertSameOrigin(req);
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AuthError) return json({ error: error.message }, error.status);
      console.error("API error:", error);
      return json({ error: "Something went wrong. Please try again." }, 500);
    }
  };
}
