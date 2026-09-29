import { CalendarDays, ClipboardList, Globe, Stethoscope, Users, Wallet } from "lucide-react";
import { BookingsOverviewChart } from "@/components/charts/overview-chart";
import { Flag } from "@/components/shared/flag";
import { StatCard } from "@/components/shared/stat-card";
import { WelcomeBanner } from "@/components/shared/welcome-banner";
import { listAuditEvents } from "@/features/audit/api";
import { getDashboardSummary } from "@/features/dashboard/api";
import type { MarketCode } from "@/features/dashboard/types";
import { formatRelativeTime } from "@/lib/format";

const bookingStatusLabel: Record<string, string> = {
  slot_held: "Slot held",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  doctor_unavailable: "Doctor unavailable",
  patient_no_show: "Patient no-show",
};

const auditActionLabel: Record<string, string> = {
  record_viewed: "viewed a record",
  record_downloaded: "downloaded a record",
  record_shared: "shared a record",
  clinical_note_signed: "signed a clinical note",
  clinical_note_amended: "amended a clinical note",
  payer_decision: "made a payer decision",
  payment_state_change: "changed a payment's state",
  admin_action: "took an admin action",
};

const markets: { code: MarketCode; name: string }[] = [
  { code: "NG", name: "Nigeria" },
  { code: "GB", name: "United Kingdom" },
];

export default async function DashboardPage() {
  const [summary, recentEvents] = await Promise.all([
    getDashboardSummary(),
    listAuditEvents({ pageSize: 5 }),
  ]);

  const { totals, bookingsByStatus, bookingsTrend, byMarket } = summary;
  const bookingsTotal = Object.values(bookingsByStatus).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Patients" value={totals.patients.toLocaleString("en-NG")} icon={Users} />
        <StatCard
          label="Active providers"
          value={totals.activeProviders.toLocaleString("en-NG")}
          icon={Stethoscope}
        />
        <StatCard label="Bookings" value={totals.bookings.toLocaleString("en-NG")} icon={CalendarDays} />
        <StatCard
          label="Successful payments"
          value={`₦${(totals.successfulPayments.amountKobo / 100).toLocaleString("en-NG")}`}
          hint={`${totals.successfulPayments.count.toLocaleString("en-NG")} transactions`}
          icon={Wallet}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-card border border-line bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Users by market</h2>
          <Globe className="size-4 text-ink-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {markets.map(({ code, name }) => {
            const market = byMarket[code];
            const share = totals.patients > 0 ? Math.round((market.patients / totals.patients) * 100) : 0;
            return (
              <div key={code} className="flex flex-col gap-3 rounded-control border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Flag code={code} className="h-5 w-7.5" />
                    {name}
                  </span>
                  <span className="rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">{code}</span>
                </div>
                <dl className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs text-ink-muted">Patients</dt>
                    <dd className="text-2xl font-bold text-ink">{market.patients.toLocaleString("en-NG")}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs text-ink-muted">New, 30 days</dt>
                    <dd className="text-2xl font-bold text-ink">
                      {market.newPatientsLast30Days.toLocaleString("en-NG")}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs text-ink-muted">Bookings</dt>
                    <dd className="text-2xl font-bold text-ink">{market.bookings.toLocaleString("en-NG")}</dd>
                  </div>
                </dl>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>Share of all patients</span>
                    <span className="font-semibold text-ink">{share}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${share}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {byMarket.other.patients > 0 && (
          <p className="text-xs text-ink-muted">
            {byMarket.other.patients.toLocaleString("en-NG")} patients are registered outside Nigeria and the UK.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Bookings, last 14 days</h2>
          <BookingsOverviewChart data={bookingsTrend} />
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
          <h2 className="text-sm font-semibold text-ink">Bookings by status</h2>
          <ul className="flex flex-col gap-3">
            {Object.entries(bookingsByStatus).map(([status, count]) => {
              const share = bookingsTotal > 0 ? Math.round((count / bookingsTotal) * 100) : 0;
              return (
                <li key={status} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>{bookingStatusLabel[status] ?? status}</span>
                    <span className="font-semibold text-ink">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${share}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Recent audit events</h2>
          <ClipboardList className="size-4 text-ink-muted" />
        </div>
        <ul className="flex flex-col divide-y divide-line">
          {recentEvents.items.length === 0 && (
            <li className="py-3 text-sm text-ink-muted">No audit events yet.</li>
          )}
          {recentEvents.items.map((event) => (
            <li key={event.id} className="flex items-start justify-between gap-3 py-3">
              <span className="text-sm text-ink">
                A {event.actorType} {auditActionLabel[event.action] ?? event.action} ({event.resourceType})
              </span>
              <span className="shrink-0 text-xs text-ink-muted">{formatRelativeTime(event.occurredAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
