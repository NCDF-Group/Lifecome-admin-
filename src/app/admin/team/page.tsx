import Link from "next/link";
import { Icon } from "@/components/console/icon";
import { PageHeader } from "@/components/console/ui";
import { TeamTable } from "@/components/console/team-table";
import { requireUser } from "@/lib/auth/session";
import { appVisibility, listUsers } from "@/lib/users";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const user = await requireUser(["superadmin"]);
  return (
    <>
      <PageHeader title="Team" sub="Everyone with access, their role, and what patients see in the app." actions={<><a className="c-btn secondary" href="/patient/#our-team" target="_blank" rel="noopener"><Icon name="external" size={16} /> View in patient app</a><Link className="c-btn primary" href="/admin/invites"><Icon name="plus" size={16} /> Invite</Link></>} />
      <TeamTable members={listUsers().map((u) => ({ ...u, app: appVisibility(u) }))} currentUserId={user.id} />
    </>
  );
}
