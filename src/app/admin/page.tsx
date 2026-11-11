import Link from "next/link";
import { AreaChart, Donut } from "@/components/console/charts";
import { Icon } from "@/components/console/icon";
import { Card, Empty, Kpi, PageHeader, RoleTag } from "@/components/console/ui";
import { overview, recentAudit } from "@/lib/analytics";
import { requireUser } from "@/lib/auth/session";
import { ACTION_LABELS, pct, timeAgo } from "@/lib/format";
import { ROLES, roleInfo } from "@/lib/roles";

export const metadata = { title: "Overview" };

export default async function AdminOverview() {
  const user = await requireUser(["superadmin"]);
  const o = overview(30);
  const activity = recentAudit(8);
  const logins = o.logins.reduce((s, p) => s + p.value, 0);
  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        sub="Everything happening across LifeCome Health roles, in one place."
        actions={<Link className="c-btn primary" href="/admin/invites"><Icon name="plus" size={16} /> Invite team member</Link>}
      />
      <div className="c-kpis">
        <Kpi icon="people" label="Team members" value={o.totals.active} hint={`${o.totals.total} total · ${o.totals.disabled} disabled`} />
        <Kpi icon="mail" tone="amber" label="Pending invites" value={o.invites.pending} hint={`${o.invites.accepted} accepted so far`} />
        <Kpi icon="clock" tone="green" label="Active this week" value={o.activeUsers7d} hint={`${o.logins7d} sign-ins in 7 days`} />
        <Kpi icon="check" tone="violet" label="Invite acceptance" value={o.invites.sent ? pct(o.invites.acceptanceRate) : "—"} hint={`${o.invites.sent} invites sent`} />
      </div>

      <div className="c-grid two">
        <Card title="Sign-ins" action={<span className="c-muted">Last 30 days · {logins} total</span>}>
          <AreaChart data={o.logins} label="Sign-ins" />
        </Card>
        <Card title="Team by role">
          <Donut
            segments={ROLES.map((r) => ({ label: r.label, value: o.roles.find((x) => x.role === r.key)?.members ?? 0, color: r.color }))}
            centre={{ value: o.totals.total, label: "members" }}
          />
        </Card>
      </div>

      <div className="c-grid two">
        <Card title="Role dashboards" action={<Link className="c-link" href="/admin/roles">View all</Link>}>
          <ul className="c-rolelist">
            {o.roles.map((r) => (
              <li key={r.role}>
                <Link href={`/admin/roles/${r.role}`}>
                  <RoleTag role={r.role} />
                  <span>{r.members} {r.members === 1 ? "member" : "members"}{r.pendingInvites ? ` · ${r.pendingInvites} pending` : ""}</span>
                  <Icon name="arrow" size={15} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Recent activity" action={<Link className="c-link" href="/admin/audit">Audit log</Link>}>
          {activity.length === 0 ? (
            <Empty title="No activity yet" />
          ) : (
            <ul className="c-feed">
              {activity.map((a) => (
                <li key={a.id}>
                  <i />
                  <div>
                    <strong>{ACTION_LABELS[a.action] ?? a.action}</strong>
                    <span>{a.target ?? a.actor_email}{a.meta ? ` · ${roleLabel(a.meta)}` : ""}</span>
                  </div>
                  <time>{timeAgo(a.at)}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function roleLabel(meta: string): string {
  try {
    const m = JSON.parse(meta) as { role?: string; to?: string };
    const r = m.role ?? m.to;
    return r ? roleInfo(r).label : "";
  } catch {
    return "";
  }
}
