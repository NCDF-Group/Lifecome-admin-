"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextValue = {
  /** Whether the persistent (`lg`+) sidebar is expanded. */
  open: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Wraps the console shell so `AppTopbar`'s hamburger and `AppSidebar`
 * share one open/closed state for the persistent desktop sidebar. Below
 * `lg`, the sidebar is always an overlay drawer instead (`MobileNav`,
 * with its own independent open state - a permanently-open overlay on
 * first mobile load would be worse than what it replaces). */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ open, toggle: () => setOpen((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
