// Mirrors Lifecome-backend's `AdminPatientRow` (src/modules/patient/patient.service.ts) -
// a patients row joined with its account's contact details and status.
export interface Patient {
  id: string;
  userAccountId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string | null;
  city: string | null;
  state: string | null;
  country: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  email: string | null;
  accountStatus: "pending_verification" | "active" | "suspended" | "closed";
}
