"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, LogOut, Monitor, Moon, Sun, UserPen, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/shared/avatar";
import { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";
import { applyThemePreference, isThemePreference, type ThemePreference } from "@/lib/theme";

const themeOptions: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const itemClass =
  "flex cursor-pointer select-none items-center gap-2 rounded-control px-2 py-1.5 text-sm text-ink outline-none data-[highlighted]:bg-surface data-[disabled]:opacity-60";

/** The avatar in the top bar: who is signed in, theme choice, edit profile and sign out. */
export function UserMenu({
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
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  // Read lazily from <html>, which the root layout set from the cookie on the server.
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof document === "undefined") return "system";
    const current = document.documentElement.dataset.theme;
    return isThemePreference(current) ? current : "system";
  });

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-link"
        >
          <Avatar name={fullName} src={avatarUrl} fallback="icon" size={36} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-card border border-line bg-card p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={fullName} src={avatarUrl} fallback="icon" size={40} />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold text-ink">{fullName}</span>
              <span className="truncate text-xs text-ink-muted">{email}</span>
              <span className="truncate text-xs text-ink-muted">{staffRoleLabel[role]}</span>
            </div>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item asChild className={itemClass}>
            <Link href="/profile">
              <UserPen className="size-4 text-ink-muted" />
              Edit profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Label className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Theme
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(value) => {
              if (!isThemePreference(value)) return;
              setTheme(value);
              applyThemePreference(value);
            }}
          >
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                // Keep the menu open so the operator sees the change land before closing it.
                onSelect={(event) => event.preventDefault()}
                className={itemClass}
              >
                <Icon className="size-4 text-ink-muted" />
                <span className="flex-1">{label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-4 text-link" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item
            disabled={signingOut}
            onSelect={(event) => {
              event.preventDefault();
              void handleSignOut();
            }}
            className={`${itemClass} text-destructive`}
          >
            <LogOut className="size-4" />
            {signingOut ? "Signing out..." : "Sign out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
