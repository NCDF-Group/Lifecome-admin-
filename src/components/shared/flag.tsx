import { useId } from "react";
import type { MarketCode } from "@/features/dashboard/types";

/**
 * Copied from Lifecome-web's `components/ui/flag.tsx`, keyed by ISO code instead of region id.
 * Inline SVG flags rather than emoji, which render as bare "NG"/"GB" letters on Windows.
 * Both are cropped to the same 3:2 box so they line up wherever they sit next to each other.
 */
export function Flag({ code, className = "h-4 w-6" }: { code: MarketCode; className?: string }) {
  const id = useId();
  const frame = `shrink-0 rounded-[3px] ring-1 ring-ink/15 ${className}`;

  if (code === "NG") {
    return (
      <svg aria-hidden viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={frame}>
        <rect width="3" height="2" fill="#fff" />
        <rect width="1" height="2" fill="#008751" />
        <rect x="2" width="1" height="2" fill="#008751" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={frame}>
      <clipPath id={`${id}-s`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-s)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
