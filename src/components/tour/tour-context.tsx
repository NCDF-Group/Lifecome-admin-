"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface TourStep {
  /** CSS selector for the element this step points at - see the `data-tour="..."` attributes
   * on AppSidebar / AppTopbar. */
  target: string;
  title: string;
  body: string;
}

/** One-time walkthrough of the console's own navigation - the sidebar, collapsing it,
 * notifications and the account menu. Not a tour of any page's content, just "how do I move
 * around this app," which is what a new staff member actually gets stuck on first. */
export const NAV_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-nav"]',
    title: "Your sections",
    body: "Everything you can do lives in here, grouped by what it's for - Care, Records, Payer & Payments and more.",
  },
  {
    target: '[data-tour="sidebar-toggle"]',
    title: "Collapse the sidebar",
    body: "Need more room? Collapse the sidebar here. Click again anytime to bring it back.",
  },
  {
    target: '[data-tour="notifications"]',
    title: "Notifications",
    body: "Anything that needs your attention shows up here.",
  },
  {
    target: '[data-tour="user-menu"]',
    title: "Your account",
    body: "Switch the theme, edit your profile, or sign out from this menu.",
  },
];

interface TourContextValue {
  active: boolean;
  stepIndex: number;
  steps: TourStep[];
  start: () => void;
  next: () => void;
  back: () => void;
  end: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  function start() {
    setStepIndex(0);
    setActive(true);
  }

  function end() {
    setActive(false);
  }

  function next() {
    setStepIndex((index) => {
      if (index >= NAV_TOUR_STEPS.length - 1) {
        setActive(false);
        return index;
      }
      return index + 1;
    });
  }

  function back() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  return (
    <TourContext.Provider value={{ active, stepIndex, steps: NAV_TOUR_STEPS, start, next, back, end }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
