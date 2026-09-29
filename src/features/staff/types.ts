export { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";

// Mirrors Lifecome-backend's `StaffSummary` (src/modules/staff/staff.service.ts).
import type { StaffRole } from "@/lib/auth/roles";

export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  status: "active" | "suspended";
  lastLoginAt: string | null;
  /** Set when the staff member has a profile photo - see `staffAvatarUrl`. */
  avatarUpdatedAt: string | null;
  createdAt: string;
}

/** The same-origin URL for a staff photo (proxied by `app/api/staff/[id]/avatar`), versioned by
 * upload time so a new photo is never hidden behind a cached old one. `null` when there's none. */
export function staffAvatarUrl(staff: Pick<StaffMember, "id" | "avatarUpdatedAt">): string | null {
  if (!staff.avatarUpdatedAt) return null;
  return `/api/staff/${staff.id}/avatar?v=${encodeURIComponent(staff.avatarUpdatedAt)}`;
}
