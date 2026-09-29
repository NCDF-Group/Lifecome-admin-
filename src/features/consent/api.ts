import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { ConsentRecord, ConsentType } from "./types";

export function listConsentRecords(
  params: { page?: number; pageSize?: number; consentType?: ConsentType; revoked?: boolean } = {},
): Promise<PaginatedResult<ConsentRecord>> {
  return adminFetch(`/admin/consent${toQueryString(params)}`);
}
