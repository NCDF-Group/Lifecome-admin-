"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { homeFor } from "@/config/navigation";
import type { StaffRole } from "@/lib/auth/roles";

/** Paths a clinician may open besides their own workspace. */
function clinicianMayOpen(pathname: string): boolean {
  return pathname === "/workspace" || pathname.startsWith("/workspace/") || pathname.startsWith("/profile");
}

/**
 * Keeps each role in its own half of the console: a clinician is sent to their workspace from any
 * admin page, and everyone else is sent to the dashboard if they open `/workspace`. This is a
 * courtesy so people never land on an error page - the real enforcement is the backend's
 * `RolesGuard`, which refuses a clinician every admin endpoint.
 */
export function RoleRouteGuard({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isClinician = role === "clinician";
    const inWorkspace = pathname === "/workspace" || pathname.startsWith("/workspace/");
    if (isClinician && !clinicianMayOpen(pathname)) router.replace(homeFor(role));
    if (!isClinician && inWorkspace) router.replace(homeFor(role));
  }, [pathname, role, router]);

  return null;
}
