"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useState } from "react";
import { navigation } from "@/config/navigation";

/** The drawer version of `AppSidebar`, shown below the `lg` breakpoint
 * where the persistent sidebar is hidden - see `app-sidebar.tsx`. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation"
          className="flex size-9 items-center justify-center rounded-control text-ink hover:bg-surface lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 overflow-y-auto bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title asChild>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <BrandLogo />
              </Link>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation"
                className="flex size-8 items-center justify-center rounded-control text-ink-muted hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {navigation.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <span className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {section.title}
              </span>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-control px-2 py-1.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  <item.icon className="size-4 shrink-0 text-ink-muted" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
