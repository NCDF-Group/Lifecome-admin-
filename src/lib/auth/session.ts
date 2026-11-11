import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_MS, userForToken, type SessionUser } from "./core.ts";
import { homeFor, type RoleKey } from "../roles.ts";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return userForToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser(roles?: RoleKey[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (roles && !roles.includes(user.role)) redirect(homeFor(user.role));
  return user;
}

export const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
});

export async function requestMeta() {
  const h = await headers();
  return { ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined, userAgent: h.get("user-agent") ?? undefined };
}
