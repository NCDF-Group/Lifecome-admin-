import { body, json, route } from "@/lib/api";
import { login } from "@/lib/auth/core";
import { cookieOptions } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/core";
import { homeFor } from "@/lib/roles";

export const POST = route(async (req) => {
  const { email, password } = await body(req);
  const { token, user } = login(email, password, {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  });
  const res = json({ user, redirect: homeFor(user.role) });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions());
  return res;
});
