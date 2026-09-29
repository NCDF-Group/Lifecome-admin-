import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/** A circular avatar for a patient, provider or staff member. Shows `src` when there is a real
 * photo; otherwise initials-on-a-tinted-circle (patients, providers), or a generic person icon
 * with `fallback="icon"` (staff, who can upload their own photo from Edit profile). No stock photo
 * is ever used in place of a specific person's picture - the same approach Lifecome-mobile's own
 * `Avatar` widget takes. */
export function Avatar({
  name,
  src,
  fallback = "initials",
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  fallback?: "initials" | "icon";
  size?: number;
  className?: string;
}) {
  const frame = cn(
    "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue/10 font-bold text-blue-strong dark:text-link",
    className,
  );

  if (src) {
    return (
      // A plain <img>: the source is an authenticated same-origin route, not a static asset
      // next/image could optimise.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} width={size} height={size} className={cn(frame, "object-cover")} />
    );
  }

  if (fallback === "icon") {
    return (
      <div role="img" aria-label={name} className={frame} style={{ width: size, height: size }}>
        <UserRound style={{ width: size * 0.55, height: size * 0.55 }} />
      </div>
    );
  }

  return (
    <div className={frame} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {getInitials(name)}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
}
