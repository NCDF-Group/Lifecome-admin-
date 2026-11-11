import { InviteManager } from "@/components/console/invite-manager";
import { PageHeader } from "@/components/console/ui";
import { listInvites } from "@/lib/invites";

export const metadata = { title: "Invites" };

export default async function InvitesPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  return (
    <>
      <PageHeader title="Invites" sub="Invite people by role. They set their own password from the link." />
      <InviteManager invites={listInvites()} defaultRole={role} />
    </>
  );
}
