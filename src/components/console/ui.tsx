import type { ReactNode } from "react";
import { roleInfo } from "@/lib/roles";
import { Icon } from "./icon";

export function Card({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`c-card ${className}`}>
      {title && (
        <header className="c-card-head">
          <h2>{title}</h2>
          {action}
        </header>
      )}
      <div className="c-card-body">{children}</div>
    </section>
  );
}

export function Kpi({ label, value, hint, icon, tone = "blue" }: { label: string; value: ReactNode; hint?: ReactNode; icon: string; tone?: "blue" | "green" | "amber" | "violet" }) {
  return (
    <div className="c-kpi">
      <span className={`c-kpi-ico ${tone}`}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {hint && <span className="c-kpi-hint">{hint}</span>}
      </div>
    </div>
  );
}

export function RoleTag({ role }: { role: string }) {
  const info = roleInfo(role);
  return (
    <span className="c-tag" style={{ ["--tag" as string]: info.color }}>
      <i /> {info.label}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`c-pill ${status}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="c-pagehead">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="c-actions">{actions}</div>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="c-empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}
