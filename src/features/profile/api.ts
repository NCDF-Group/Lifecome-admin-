import { adminFetch } from "@/lib/api/admin";
import type { StaffMember } from "@/features/staff/types";

/** The signed-in staff member's own account (`GET /admin/staff/me`). */
export function getMyProfile(): Promise<StaffMember> {
  return adminFetch("/admin/staff/me");
}
