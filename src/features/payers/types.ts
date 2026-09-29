// Mirrors Lifecome-backend's `payers` table (src/db/schema/payer.schema.ts). Real fields only -
// the backend has no supportPhone/activeMembers/integrationStatus columns, so those demo-only
// fields are gone rather than shown as fabricated data.
export type PayerIntegrationMode =
  | "realtime_api"
  | "secure_batch_file"
  | "operations_portal"
  | "rules_configuration";

export interface Payer {
  id: string;
  code: string;
  name: string;
  integrationMode: PayerIntegrationMode;
  isLive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
