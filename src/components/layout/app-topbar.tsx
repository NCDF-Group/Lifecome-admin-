"use client";

import { Bell, Menu } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { UserMenu } from "@/components/layout/user-menu";
import { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";

/**
 * The bar above every console page: a sidebar hamburger (the persistent
 * `lg`+ sidebar below `lg`, `MobileNav`'s drawer above), a title slot,
 * and the signed-in staff member's identity, with `UserMenu` behind the
 * avatar (theme, edit profile, sign out). Global search
 * (command palette) is not wired up yet.
 */
export function AppTopbar({
  fullName,
  email,
  role,
  avatarUrl,
}: {
  fullName: string;
  email: string;
  role: StaffRole;
  avatarUrl: string | null;
}) {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="hidden size-9 items-center justify-center rounded-control text-ink hover:bg-surface lg:flex"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-sm font-semibold text-ink">
          LifeCome Live - Operations console
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        {/* TODO: command palette trigger */}
        <Bell className="size-4" />
        <span className="hidden sm:flex sm:flex-col sm:items-end sm:leading-tight">
          <span className="text-ink">{fullName}</span>
          <span className="text-xs">{staffRoleLabel[role]}</span>
        </span>
        <UserMenu fullName={fullName} email={email} role={role} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
