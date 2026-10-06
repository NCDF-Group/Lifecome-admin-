import type { Appointment, AppointmentDetail } from "@/features/bookings/types";
import type { Provider } from "@/features/providers/types";

// Mirrors Lifecome-backend's `/clinician/*` responses (src/modules/clinician/clinician.service.ts).

/** One row of the doctor's agenda: the appointment, the patient's name, and when it starts. */
export type ClinicianAppointment = Omit<Appointment, "providerName" | "feeKobo"> & {
  startsAt: string;
  durationMinutes: number;
};

export interface ClinicianPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string | null;
  city: string | null;
  state: string | null;
}

export type ClinicianAppointmentDetail = Omit<AppointmentDetail, "providerName" | "feeKobo" | "patientName"> & {
  patient: ClinicianPatient;
};

export interface ClinicianProfile {
  provider: Provider;
}

export interface AvailabilitySlot {
  id: string;
  providerId: string;
  startsAt: string;
  durationMinutes: number;
  isBooked: boolean;
  heldUntil: string | null;
}
