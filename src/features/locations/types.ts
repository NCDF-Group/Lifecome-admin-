// Mirrors Lifecome-backend's `LocationsOverview` (src/modules/admin-dashboard/admin-locations.service.ts).
export interface LocationSummary {
  city: string;
  state: string;
  patientCount: number;
  providerCount: number;
}

export interface LocationsOverview {
  locations: LocationSummary[];
  unregistered: { patients: number; providers: number };
}
