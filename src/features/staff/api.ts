import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { StaffMember, StaffRole } from "./types";

export function listStaff(
  params: { page?: number; pageSize?: number; role?: StaffRole; status?: "active" | "suspended" } = {},
): Promise<PaginatedResult<StaffMember>> {
  return adminFetch(`/admin/staff${toQueryString(params)}`);
}
