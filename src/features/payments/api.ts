import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { PaymentStatus, PaymentTransaction } from "./types";

export function listPayments(
  params: { page?: number; pageSize?: number; status?: PaymentStatus } = {},
): Promise<PaginatedResult<PaymentTransaction>> {
  return adminFetch(`/admin/payments${toQueryString(params)}`);
}
