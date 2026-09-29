import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { EligibilityCheck, EligibilityStatus } from "./types";

export function listEligibilityChecks(
  params: { page?: number; pageSize?: number; status?: EligibilityStatus } = {},
): Promise<PaginatedResult<EligibilityCheck>> {
  return adminFetch(`/admin/eligibility-checks${toQueryString(params)}`);
}
