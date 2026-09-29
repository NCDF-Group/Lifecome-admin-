import { adminFetch } from "@/lib/api/admin";
import type { ClinicalService } from "./types";

/** `GET /clinical-services` has no admin guard (same list the booking flow uses) - `adminFetch`
 * still attaches the staff bearer token, which the backend simply ignores here. */
export function listServices(): Promise<ClinicalService[]> {
  return adminFetch("/clinical-services");
}
