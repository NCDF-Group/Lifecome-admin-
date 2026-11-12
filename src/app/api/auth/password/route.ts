import { body, json, route, userFromRequest } from "@/lib/api";
import { AuthError, SESSION_COOKIE, changePassword } from "@/lib/auth/core";
import { completeInvitesFor } from "@/lib/invites";
import { homeFor } from "@/lib/roles";

/** Change your own password. This is the one endpoint open to users who still have a default password. */
export const POST = route(async (req) => {
  const user = userFromRequest(req);
  if (!user) throw new AuthError("Sign in to continue.", 401);
  const { currentPassword, newPassword } = await body(req);
  changePassword(user.id, currentPassword, newPassword, req.cookies.get(SESSION_COOKIE)?.value);
  completeInvitesFor(user.id);
  return json({ ok: true, redirect: homeFor(user.role) });
});
