import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";
import { previewInvite } from "@/lib/invites";
import { roleInfo } from "@/lib/roles";

export const metadata: Metadata = { title: "Accept your invitation" };
export const dynamic = "force-dynamic";

const MESSAGES = {
  invalid: "This invite link isn’t valid. Check you copied the whole link, or ask for a new one.",
  expired: "This invite has expired. Ask your administrator to send you a new one.",
  revoked: "This invite was withdrawn. Ask your administrator to send you a new one.",
  accepted: "This invite has already been used. Sign in with the account you created.",
} as const;

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = previewInvite(token);
  if (!result.ok) {
    return (
      <AuthShell title="Invitation unavailable" sub={MESSAGES[result.reason]}>
        <Link className="c-btn primary lg" href="/">Go to sign in</Link>
      </AuthShell>
    );
  }
  const { invite } = result;
  return (
    <AuthShell
      title="Join LifeCome Health"
      sub={`${invite.invitedBy ? invite.invitedBy + " invited you" : "You’ve been invited"} as ${roleInfo(invite.role).label}. Set up your account to continue.`}
    >
      <AcceptInviteForm token={token} email={invite.email} defaultName={invite.name ?? ""} />
    </AuthShell>
  );
}
