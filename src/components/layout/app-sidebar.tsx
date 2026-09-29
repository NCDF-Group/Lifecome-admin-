"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { navigation } from "@/config/navigation";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

/**
 * The console's left-hand navigation. Renders every section from
 * `config/navigation.ts` as icon + label links - no active-route
 * highlighting or permission filtering by staff role yet (the last needs
 * the admin-auth work in README.md to land first). Hidden below the `lg`
 * breakpoint (`MobileNav` covers that instead); at `lg`+, its width
 * collapses/expands with `AppTopbar`'s hamburger via `useSidebar`.
 */
export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <nav
      className={cn(
        "hidden shrink-0 overflow-hidden border-r border-line bg-card transition-[width] duration-200 lg:block",
        open ? "w-60" : "w-0",
      )}
    >
      <div className="flex h-full w-60 flex-col gap-6 overflow-y-auto p-4">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <BrandLogo priority />
        </Link>
        {navigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <span className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {section.title}
            </span>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-control px-2 py-1.5 text-sm font-medium text-ink hover:bg-surface"
              >
                <item.icon className="size-4 shrink-0 text-ink-muted" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
