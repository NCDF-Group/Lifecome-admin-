import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** The icon + title (+ optional trailing action) every console page opens
 * with. Kept to one component so a page's heading always looks the same,
 * and so any "demo data" framing lives in README.md rather than in the
 * UI a staff member actually sees. */
export function PageHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-blue/10 text-blue">
          <Icon className="size-5" />
        </div>
        <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
