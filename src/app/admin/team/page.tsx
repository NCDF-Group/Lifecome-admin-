import Link from "next/link";
import { Icon } from "@/components/console/icon";
import { PageHeader } from "@/components/console/ui";
import { TeamTable } from "@/components/console/team-table";
import { requireUser } from "@/lib/auth/session";
import { listUsers } from "@/lib/users";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const user = await requireUser(["superadmin"]);
  return (
    <>
      <PageHeader title="Team" sub="Everyone with access, their role and status." actions={<Link className="c-btn primary" href="/admin/invites"><Icon name="plus" size={16} /> Invite</Link>} />
      <TeamTable members={listUsers()} currentUserId={user.id} />
    </>
  );
}
