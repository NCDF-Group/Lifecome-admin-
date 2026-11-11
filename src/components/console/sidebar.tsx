"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "./icon";

const NAV = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/roles", label: "Roles", icon: "roles" },
  { href: "/admin/team", label: "Team", icon: "people" },
  { href: "/admin/invites", label: "Invites", icon: "mail" },
  { href: "/admin/analytics", label: "Analytics", icon: "chart" },
  { href: "/admin/audit", label: "Audit log", icon: "log" },
];

export function Sidebar({ user }: { user: { name: string; email: string } }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === href : path === href || path.startsWith(href + "/"));
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <aside className="c-side">
      <Link href="/admin" className="c-side-brand" aria-label="LifeCome Health admin">
        <BrandLogo dark size="sm" />
      </Link>
      <p className="c-side-label">Administration</p>
      <nav>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="c-side-user">
        <span className="c-avatar">{initials}</span>
        <div>
          <strong>{user.name}</strong>
          <small>Super administrator</small>
        </div>
      </div>
    </aside>
  );
}
