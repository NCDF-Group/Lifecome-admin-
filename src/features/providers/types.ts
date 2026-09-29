// Mirrors Lifecome-backend's `providers` table (src/db/schema/provider.schema.ts). Real fields
// only - the backend has no rating/review/qualifications/years-of-experience columns, so those
// demo-only fields are gone rather than shown as fabricated data.
export type NetworkStatus = "active" | "suspended" | "pending_review";

export interface Provider {
  id: string;
  displayName: string;
  specialty: string;
  languages: string[];
  consultationModes: ("video" | "audio")[];
  networkStatus: NetworkStatus;
  city: string | null;
  state: string | null;
  createdAt: string;
}
