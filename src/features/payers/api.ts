import { adminFetch } from "@/lib/api/admin";
import type { Payer } from "./types";

/** `GET /payers` has no admin guard and returns a plain array, not a paginated envelope - the
 * same list the patient app's HMO-selection screen uses. */
export function listPayers(): Promise<Payer[]> {
  return adminFetch("/payers");
}

/** No single-payer endpoint exists yet - find within the (small) full list instead. */
export async function getPayer(id: string): Promise<Payer | undefined> {
  const payers = await listPayers();
  return payers.find((payer) => payer.id === id);
}
