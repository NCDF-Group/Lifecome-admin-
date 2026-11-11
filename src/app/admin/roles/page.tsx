import Link from "next/link";
import { Icon } from "@/components/console/icon";
import { PageHeader } from "@/components/console/ui";
import { roleSummaries } from "@/lib/analytics";
import { timeAgo } from "@/lib/format";
import { ROLES } from "@/lib/roles";

export const metadata = { title: "Roles" };

export default function RolesPage() {
  const summaries = roleSummaries();
  return (
    <>
      <PageHeader title="Roles" sub="A dashboard for every role on the platform." />
      <div className="c-rolecards">
        {ROLES.map((r) => {
          const s = summaries.find((x) => x.role === r.key)!;
          return (
            <Link key={r.key} href={`/admin/roles/${r.key}`} className="c-rolecard" style={{ ["--tag" as string]: r.color }}>
              <span className="c-rolecard-dot" />
              <h3>{r.label}</h3>
              <p>{r.description}</p>
              <dl>
                <div><dt>Members</dt><dd>{s.members}</dd></div>
                <div><dt>Active</dt><dd>{s.active}</dd></div>
                <div><dt>Pending</dt><dd>{s.pendingInvites}</dd></div>
              </dl>
              <footer><span>Last sign-in {timeAgo(s.lastLoginAt)}</span><Icon name="arrow" size={15} /></footer>
            </Link>
          );
        })}
      </div>
    </>
  );
}
