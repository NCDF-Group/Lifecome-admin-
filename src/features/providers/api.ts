import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { NetworkStatus, Provider } from "./types";

export function listProviders(
  params: { page?: number; pageSize?: number; search?: string; networkStatus?: NetworkStatus } = {},
): Promise<PaginatedResult<Provider>> {
  return adminFetch(`/admin/providers${toQueryString(params)}`);
}

export function getProvider(id: string): Promise<Provider> {
  return adminFetch(`/admin/providers/${id}`);
}
