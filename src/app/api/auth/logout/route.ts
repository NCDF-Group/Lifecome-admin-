import { json, route } from "@/lib/api";
import { SESSION_COOKIE, logout } from "@/lib/auth/core";

export const POST = route(async (req) => {
  logout(req.cookies.get(SESSION_COOKIE)?.value);
  const res = json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
});
