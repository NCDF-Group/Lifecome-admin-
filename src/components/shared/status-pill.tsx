import { cn } from "@/lib/utils";

const toneClasses = {
  success: "bg-positive/10 text-positive",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-blue/10 text-blue-strong",
  neutral: "bg-surface text-ink-muted",
} as const;

/** The small coloured status badge used across every list/detail page -
 * the web equivalent of Lifecome-mobile's `StatusChip`. */
export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof toneClasses;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}
