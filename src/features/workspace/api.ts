import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type {
  AvailabilitySlot,
  ClinicianAppointment,
  ClinicianAppointmentDetail,
  ClinicianProfile,
} from "./types";

/** The doctor's own provider profile. Fails (403) if the account isn't linked to one. */
export function getClinicianProfile(): Promise<ClinicianProfile> {
  return adminFetch("/clinician/me");
}

export function listClinicianAppointments(
  params: { scope?: "upcoming" | "past" | "all"; page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<ClinicianAppointment>> {
  return adminFetch(`/clinician/appointments${toQueryString(params)}`);
}

export function getClinicianAppointment(id: string): Promise<ClinicianAppointmentDetail> {
  return adminFetch(`/clinician/appointments/${id}`);
}

export function listMySlots(): Promise<AvailabilitySlot[]> {
  return adminFetch("/clinician/availability");
}
