import { Empty, PageHeader } from "@/components/console/ui";
import { recentAudit } from "@/lib/analytics";
import { ACTION_LABELS, fmtDateTime } from "@/lib/format";

export const metadata = { title: "Audit log" };

export default function AuditPage() {
  const rows = recentAudit(200);
  return (
    <>
      <PageHeader title="Audit log" sub="The latest 200 security and administration events." />
      <section className="c-card">
        {rows.length === 0 ? <Empty title="No events yet" /> : (
          <div className="c-table-wrap">
            <table className="c-table">
              <thead><tr><th>When</th><th>Event</th><th>Actor</th><th>Target</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtDateTime(r.at)}</td>
                    <td><strong>{ACTION_LABELS[r.action] ?? r.action}</strong></td>
                    <td>{r.actor_email ?? "—"}</td>
                    <td>{r.target ?? "—"}{r.meta && <small>{r.meta}</small>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
