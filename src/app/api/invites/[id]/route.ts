import { json, origin, requireApiUser, route } from "@/lib/api";
import { markEmailed, reissueInvite, revokeInvite } from "@/lib/invites";
import { sendInviteEmail } from "@/lib/mailer";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE revokes the invite. */
export const DELETE = route<Ctx>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  revokeInvite((await ctx.params).id, actor);
  return json({ ok: true });
});

/** POST re-issues a fresh link (and emails it when email is configured). */
export const POST = route<Ctx>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const invite = reissueInvite((await ctx.params).id, actor);
  const link = `${origin(req)}/invite/${invite.token}`;
  const mail = await sendInviteEmail({ to: invite.email, link, role: invite.role, name: invite.name, invitedBy: actor.email });
  if (mail.sent) markEmailed(invite.id);
  return json({ id: invite.id, email: invite.email, link, emailed: mail.sent, emailNote: mail.sent ? null : mail.reason }, 201);
});
