import type { LucideIcon } from "lucide-react";

/** A single dashboard number. No trend arrow/delta - the backend's `/admin/dashboard` aggregate
 * is a point-in-time count, not a comparison against a prior period, so showing "+8% vs
 * yesterday" would be fabricated rather than computed. `hint` is an optional plain-text second
 * line for extra context (e.g. a transaction count next to a currency total). */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-control bg-blue/10 text-blue">
          <Icon className="size-4" />
        </div>
      </div>
      <span className="text-3xl font-bold text-ink">{value}</span>
      {hint && <span className="text-xs font-medium text-ink-muted">{hint}</span>}
    </div>
  );
}
