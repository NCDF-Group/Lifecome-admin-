import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { Patient } from "./types";

export function listPatients(
  params: { page?: number; pageSize?: number; search?: string } = {},
): Promise<PaginatedResult<Patient>> {
  return adminFetch(`/admin/patients${toQueryString(params)}`);
}

export function getPatient(id: string): Promise<Patient> {
  return adminFetch(`/admin/patients/${id}`);
}
