// Mirrors Lifecome-backend's `clinicalServices` table (src/db/schema/catalogue.schema.ts).
export interface ClinicalService {
  id: string;
  code: string;
  name: string;
  description: string | null;
  defaultDurationMinutes: number;
  basePriceKobo: number;
  isActive: boolean;
  createdAt: string;
}
