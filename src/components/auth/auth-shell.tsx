import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";

export function AuthShell({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div className="a-shell">
      <aside className="a-hero">
        <BrandLogo dark size="lg" />
        <div>
          <h2>Connected care.<br />Clear decisions.<br /><em>One patient record.</em></h2>
          <p>A considered workspace for the people behind every appointment, result and moment of care.</p>
        </div>
        <small>© LifeCome Health</small>
      </aside>
      <main className="a-panel">
        <div className="a-card">
          <div className="a-mobile-logo"><BrandLogo size="md" /></div>
          <h1>{title}</h1>
          {sub && <p className="a-sub">{sub}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
