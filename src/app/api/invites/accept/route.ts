import { body, json, route } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/auth/core";
import { cookieOptions } from "@/lib/auth/session";
import { acceptInvite } from "@/lib/invites";
import { homeFor } from "@/lib/roles";

export const POST = route(async (req) => {
  const { token, currentPassword, name, newPassword } = await body<{ token?: string; currentPassword?: unknown; name?: unknown; newPassword?: unknown }>(req);
  if (typeof token !== "string" || !token) return json({ error: "This invite link is no longer valid." }, 410);
  const { token: sessionToken, user } = acceptInvite(token, { currentPassword, name, newPassword }, {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });
  const res = json({ user, redirect: homeFor(user.role) }, 201);
  res.cookies.set(SESSION_COOKIE, sessionToken, cookieOptions());
  return res;
});
