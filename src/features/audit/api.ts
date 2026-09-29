import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { ActorType, AuditEvent } from "./types";

export function listAuditEvents(
  params: { page?: number; pageSize?: number; actorType?: ActorType; resourceType?: string } = {},
): Promise<PaginatedResult<AuditEvent>> {
  return adminFetch(`/admin/audit-events${toQueryString(params)}`);
}
