"use client";

import { HelpCircle } from "lucide-react";
import { useTour } from "@/components/tour/tour-context";

/** Replays the navigation tour on demand - the auto-run in `NavTour` only ever fires once per
 * browser, so this is how someone finds it again later. */
export function TourTrigger() {
  const { start } = useTour();

  return (
    <button
      type="button"
      onClick={start}
      aria-label="Take a tour of the console"
      title="Take a tour"
      className="flex size-9 items-center justify-center rounded-control text-ink-muted hover:bg-surface hover:text-ink"
    >
      <HelpCircle className="size-4" />
    </button>
  );
}
