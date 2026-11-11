import { body, json, origin, requireApiUser, route } from "@/lib/api";
import { createInvite, listInvites, markEmailed } from "@/lib/invites";
import { sendInviteEmail } from "@/lib/mailer";

export const GET = route(async (req) => {
  requireApiUser(req, ["superadmin"]);
  return json({ invites: listInvites() });
});

export const POST = route(async (req) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const input = await body<{ email?: unknown; role?: unknown; name?: unknown }>(req);
  const invite = createInvite(input, actor);
  const link = `${origin(req)}/invite/${invite.token}`;
  const mail = await sendInviteEmail({ to: invite.email, link, role: invite.role, name: invite.name, invitedBy: actor.email });
  if (mail.sent) markEmailed(invite.id);
  return json({ id: invite.id, email: invite.email, role: invite.role, link, emailed: mail.sent, emailNote: mail.sent ? null : mail.reason }, 201);
});
