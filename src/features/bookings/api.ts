import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { Appointment, AppointmentDetail, BookingStatus } from "./types";

export function listBookings(
  params: { page?: number; pageSize?: number; status?: BookingStatus } = {},
): Promise<PaginatedResult<Appointment>> {
  return adminFetch(`/admin/bookings${toQueryString(params)}`);
}

export function getBooking(id: string): Promise<AppointmentDetail> {
  return adminFetch(`/admin/bookings/${id}`);
}
