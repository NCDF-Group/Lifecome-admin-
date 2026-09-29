import { adminFetch } from "@/lib/api/admin";
import type { LocationsOverview } from "./types";

export function getLocationsOverview(): Promise<LocationsOverview> {
  return adminFetch("/admin/locations");
}
