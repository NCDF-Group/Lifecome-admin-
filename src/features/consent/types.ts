// Mirrors Lifecome-backend's `AdminConsentRow` (src/modules/consent/consent.service.ts). Real
// consent here means a patient consenting to a versioned platform document (terms, privacy
// notice, treatment, record sharing) - not "granting access to a named person", which the old
// demo data modelled but the backend does not.
export type ConsentType = "terms_of_use" | "privacy_notice" | "clinical_treatment" | "record_sharing";

export interface ConsentRecord {
  id: string;
  patientId: string;
  consentType: ConsentType;
  documentVersion: string;
  channel: string;
  grantedAt: string;
  revokedAt: string | null;
  patientName: string;
}
