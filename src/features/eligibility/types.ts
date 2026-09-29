// Mirrors Lifecome-backend's `AdminEligibilityCheckRow` (src/modules/eligibility/eligibility.service.ts).
export type EligibilityStatus =
  | "covered"
  | "co_pay"
  | "pre_authorisation_required"
  | "excluded"
  | "benefit_limit_reached"
  | "payer_unavailable";

export interface EligibilityCheck {
  id: string;
  membershipId: string;
  clinicalServiceId: string;
  status: EligibilityStatus;
  coPayKobo: string | null;
  checkedAt: string;
  patientName: string;
  payerName: string;
  serviceName: string;
}
