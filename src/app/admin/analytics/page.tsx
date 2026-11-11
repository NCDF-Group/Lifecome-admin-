import Link from "next/link";
import { AreaChart, BarChart, Donut, HBars } from "@/components/console/charts";
import { Card, Kpi, PageHeader } from "@/components/console/ui";
import { overview } from "@/lib/analytics";
import { pct } from "@/lib/format";
import { ROLES } from "@/lib/roles";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const requested = Number((await searchParams).days);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const o = overview(days);
  const sum = (a: { value: number }[]) => a.reduce((s, p) => s + p.value, 0);
  return (
    <>
      <PageHeader
        title="Analytics"
        sub="Access, invitations and growth across every role."
        actions={
          <div className="c-seg" role="group" aria-label="Date range">
            {[7, 30, 90].map((d) => (
              <Link key={d} href={`/admin/analytics?days=${d}`} aria-current={d === days ? "true" : undefined}>{d} days</Link>
            ))}
          </div>
        }
      />
      <div className="c-kpis">
        <Kpi icon="clock" tone="green" label="Active users (7d)" value={o.activeUsers7d} hint={`of ${o.totals.active} active members`} />
        <Kpi icon="chart" label="Sign-ins (7d)" value={o.logins7d} />
        <Kpi icon="lock" tone="amber" label="Failed sign-ins (7d)" value={o.failedLogins7d} hint="Watch for sudden spikes" />
        <Kpi icon="mail" tone="violet" label="Avg. time to accept" value={o.invites.avgHoursToAccept === null ? "—" : `${o.invites.avgHoursToAccept < 1 ? "<1" : Math.round(o.invites.avgHoursToAccept)}h`} hint={`${pct(o.invites.acceptanceRate)} acceptance`} />
      </div>
      <div className="c-grid two">
        <Card title="Sign-ins" action={<span className="c-muted">{sum(o.logins)} in {days} days</span>}><AreaChart data={o.logins} label="Sign-ins" /></Card>
        <Card title="New team members" action={<span className="c-muted">{sum(o.joined)} in {days} days</span>}><AreaChart data={o.joined} color="#45af03" label="New members" /></Card>
      </div>
      <div className="c-grid two">
        <Card title="Invites sent" action={<span className="c-muted">{sum(o.invitesSent)} in {days} days</span>}><BarChart data={o.invitesSent} color="#0e9bb3" label="Invites sent" /></Card>
        <Card title="Invite funnel">
          <HBars rows={[
            { label: "Sent", value: o.invites.sent, color: "#0667b8" },
            { label: "Accepted", value: o.invites.accepted, color: "#45af03" },
            { label: "Pending", value: o.invites.pending, color: "#b58a35" },
            { label: "Expired", value: o.invites.expired, color: "#9aa9b7" },
            { label: "Revoked", value: o.invites.revoked, color: "#c2554a" },
          ]} />
        </Card>
      </div>
      <Card title="Members by role">
        <Donut
          segments={ROLES.map((r) => ({ label: r.label, value: o.roles.find((x) => x.role === r.key)?.members ?? 0, color: r.color }))}
          centre={{ value: o.totals.total, label: "members" }}
        />
      </Card>
    </>
  );
}
