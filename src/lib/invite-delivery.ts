import type { NextRequest } from "next/server";
import { origin } from "./api.ts";
import { markEmailed, type IssuedInvite } from "./invites.ts";
import { sendInviteEmail } from "./mailer.ts";

/** Shared by create and re-issue: email the link if configured, and return everything the admin needs to share. */
export async function deliver(req: NextRequest, invite: IssuedInvite, inviter: string) {
  const link = `${origin(req)}/invite/${invite.token}`;
  const mail = await sendInviteEmail({ to: invite.email, link, role: invite.role, name: invite.name, invitedBy: inviter, expiresAt: invite.expiresAt });
  if (mail.sent) markEmailed(invite.id);
  return {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    link,
    signInUrl: `${origin(req)}/`,
    defaultPassword: invite.defaultPassword,
    expiresAt: invite.expiresAt,
    emailed: mail.sent,
    emailNote: mail.sent ? null : mail.reason,
  };
}

