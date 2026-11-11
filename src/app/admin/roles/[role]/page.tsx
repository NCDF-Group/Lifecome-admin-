import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/console/icon";
import { Card, Empty, Kpi, PageHeader, StatusPill } from "@/components/console/ui";
import { recentAudit, roleSummaries } from "@/lib/analytics";
import { ACTION_LABELS, fmtDateTime, timeAgo } from "@/lib/format";
import { listInvites } from "@/lib/invites";
import { isRole, roleInfo } from "@/lib/roles";
import { listUsers } from "@/lib/users";

export default async function RoleDashboard({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!isRole(role)) notFound();
  const info = roleInfo(role);
  const summary = roleSummaries().find((r) => r.role === role)!;
  const members = listUsers().filter((u) => u.role === role);
  const pending = listInvites().filter((i) => i.role === role && i.status === "pending");
  const activity = recentAudit(12, role);
  return (
    <>
      <PageHeader
        title={info.label}
        sub={info.description}
        actions={
          <>
            {role !== "superadmin" && (
              <>
                <Link className="c-btn secondary" href={`/portal?as=${role}`}><Icon name="external" size={16} /> Open workspace</Link>
                <Link className="c-btn primary" href={`/admin/invites?role=${role}`}><Icon name="plus" size={16} /> Invite {info.label.toLowerCase()}</Link>
              </>
            )}
          </>
        }
      />
      <div className="c-kpis">
        <Kpi icon="people" label="Members" value={summary.members} />
        <Kpi icon="check" tone="green" label="Active" value={summary.active} />
        <Kpi icon="mail" tone="amber" label="Pending invites" value={summary.pendingInvites} />
        <Kpi icon="clock" tone="violet" label="Last sign-in" value={<span className="c-kpi-sm">{timeAgo(summary.lastLoginAt)}</span>} />
      </div>
      <div className="c-grid two-wide">
        <Card title="Members">
          {members.length === 0 ? (
            <Empty title={`No ${info.label.toLowerCase()} members yet`}>Invite someone to this role to get started.</Empty>
          ) : (
            <table className="c-table flush">
              <thead><tr><th>Member</th><th>Status</th><th>Last sign-in</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}><td><strong>{m.name}</strong><small>{m.email}</small></td><td><StatusPill status={m.status} /></td><td>{timeAgo(m.last_login_at)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <div className="c-stack">
          <Card title="Pending invites">
            {pending.length === 0 ? <Empty title="Nothing pending" /> : (
              <ul className="c-feed">
                {pending.map((i) => (
                  <li key={i.id}><i /><div><strong>{i.name || i.email}</strong><span>Expires {fmtDateTime(i.expires_at)}</span></div></li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Recent activity">
            {activity.length === 0 ? <Empty title="No activity yet" /> : (
              <ul className="c-feed">
                {activity.map((a) => (
                  <li key={a.id}><i /><div><strong>{ACTION_LABELS[a.action] ?? a.action}</strong><span>{a.actor_email}</span></div><time>{timeAgo(a.at)}</time></li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
