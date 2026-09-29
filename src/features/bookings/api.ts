import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { Appointment, BookingStatus } from "./types";

export function listBookings(
  params: { page?: number; pageSize?: number; status?: BookingStatus } = {},
): Promise<PaginatedResult<Appointment>> {
  return adminFetch(`/admin/bookings${toQueryString(params)}`);
}
