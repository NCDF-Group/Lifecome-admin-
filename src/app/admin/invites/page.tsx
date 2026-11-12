import { InviteManager } from "@/components/console/invite-manager";
import { PageHeader } from "@/components/console/ui";
import { listInvites } from "@/lib/invites";

export const metadata = { title: "Invites" };

export default async function InvitesPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  return (
    <>
      <PageHeader title="Invites" sub="Create staff accounts by role with a default password. They choose their own password on first sign-in." />
      <InviteManager invites={listInvites()} defaultRole={role} />
    </>
  );
}
