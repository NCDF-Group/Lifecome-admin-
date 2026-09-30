"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useTour } from "@/components/tour/tour-context";

const SEEN_KEY = "lifecome-admin:seen-nav-tour";

type Rect = { top: number; left: number; width: number; height: number };

function measure(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

/**
 * A from-scratch guided tour of the console's navigation chrome (sidebar, its collapse toggle,
 * notifications, account menu) - no external tour library, since the whole thing is four steps
 * of "highlight this element, show an arrow and a sentence." Runs once automatically on a
 * console user's first visit (tracked in localStorage) and can be replayed anytime via
 * `TourTrigger` in AppTopbar.
 */
export function NavTour() {
  const { active, stepIndex, steps, start, next, back, end } = useTour();
  const { open, setOpen } = useSidebar();
  const [rect, setRect] = useState<Rect | null>(null);
  const step = steps[stepIndex];

  // First-visit auto-start, once per browser.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) {
        window.localStorage.setItem(SEEN_KEY, "1");
        start();
      }
    } catch {
      // Private browsing / storage disabled - just skip the auto-tour, the manual trigger still works.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The first step targets the sidebar itself - make sure it's actually open to see it.
  useEffect(() => {
    if (active && stepIndex === 0 && !open) setOpen(true);
  }, [active, stepIndex, open, setOpen]);

  useLayoutEffect(() => {
    if (!active) return;

    function update() {
      setRect(measure(step.target));
    }

    update();
    // A layout change (sidebar collapsing/expanding, window resize) can move the target.
    window.addEventListener("resize", update);
    const raf = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [active, step, stepIndex]);

  if (!active || !rect) return null;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const cardWidth = 300;
  const gap = 14;

  // A target taller than most of the viewport (the sidebar) has no meaningful "above" or
  // "below" - anchor beside it instead, vertically centered, regardless of the card's own
  // (variable, per-step) height.
  const isSidePanel = rect.height > viewportHeight * 0.6;

  let placement: { top?: number | string; bottom?: number; left?: number; right?: number; transform?: string };
  let arrow: "up" | "down" | "left" | "right";

  if (isSidePanel) {
    const panelOnLeft = rect.left < viewportWidth / 2;
    arrow = panelOnLeft ? "left" : "right";
    placement = {
      top: "50%",
      transform: "translateY(-50%)",
      ...(panelOnLeft
        ? { left: Math.min(rect.left + rect.width + gap, viewportWidth - cardWidth - 12) }
        : { right: Math.min(viewportWidth - rect.left + gap, viewportWidth - cardWidth - 12) }),
    };
  } else {
    const placeBelow = rect.top + rect.height / 2 < viewportHeight / 2;
    arrow = placeBelow ? "up" : "down";
    placement = {
      left: Math.min(Math.max(rect.left, 12), viewportWidth - cardWidth - 12),
      top: placeBelow ? rect.top + rect.height + gap : undefined,
      bottom: placeBelow ? undefined : viewportHeight - rect.top + gap,
    };
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={end} />

      {/* Highlight ring around the current target - not interactive, purely a spotlight. */}
      <div
        className="pointer-events-none absolute rounded-control ring-4 ring-accent transition-all duration-200"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />

      <div
        className="absolute flex flex-col gap-2 rounded-card bg-card p-4 text-sm shadow-xl"
        style={{ ...placement, width: cardWidth }}
      >
        {arrow === "up" && <ArrowUp className="absolute -top-3.5 left-6 size-5 text-accent" aria-hidden />}
        {arrow === "down" && <ArrowDown className="absolute -bottom-3.5 left-6 size-5 text-accent" aria-hidden />}
        {arrow === "left" && (
          <ArrowLeft className="absolute top-1/2 -left-3.5 size-5 -translate-y-1/2 text-accent" aria-hidden />
        )}
        {arrow === "right" && (
          <ArrowRight className="absolute top-1/2 -right-3.5 size-5 -translate-y-1/2 text-accent" aria-hidden />
        )}

        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-ink">{step.title}</h2>
          <button
            type="button"
            onClick={end}
            aria-label="Close tour"
            className="-m-1 rounded-control p-1 text-ink-muted hover:bg-surface"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-ink-muted">{step.body}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            {stepIndex + 1} of {steps.length}
          </span>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={back}
                className="rounded-control px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="rounded-control bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent"
            >
              {stepIndex === steps.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
