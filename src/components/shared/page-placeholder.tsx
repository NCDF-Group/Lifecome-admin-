import { Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

/**
 * Stands in for every console page until its real module is built: a
 * `PageHeader` plus an icon-led empty state, so the route tree is
 * navigable and demonstrable before any data-fetching or table/form work
 * exists. Delete this import once a page has real content.
 */
export function PagePlaceholder({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={icon} title={title} />
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line px-8 py-16 text-center">
        <Construction className="size-8 text-ink-muted" />
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}
