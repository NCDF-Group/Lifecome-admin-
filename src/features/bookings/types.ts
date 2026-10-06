// Mirrors Lifecome-backend's `AdminAppointmentRow` / `AdminAppointmentDetail`
// (src/modules/booking/booking.service.ts).
export type BookingStatus =
  | "slot_held"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "doctor_unavailable"
  | "patient_no_show";

export type ConsultationMode = "video" | "audio" | "in_person";

export type FundingRoute = "pay_per_visit" | "lifecome_benefits" | "workplace" | "membership";

/** The "Prepare for ..." answers the patient gave in the app (`appointments.intake`). */
export interface AppointmentIntake {
  reason?: string;
  medicinesAndAllergies?: string;
  accessibilitySupport?: string;
  callbackNumber?: string;
  patientLocation?: string;
  understoodRemoteLimits?: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  clinicalServiceId: string;
  availabilitySlotId: string;
  consultationMode: ConsultationMode;
  status: BookingStatus;
  authorisationId: string | null;
  presentingConcern: string | null;
  fundingRoute: FundingRoute;
  locationCity: string | null;
  clinicName: string | null;
  intake: AppointmentIntake | null;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  providerName: string;
  serviceName: string;
  feeKobo: number;
}

/** `GET /admin/bookings/:id` - the row plus when the appointment starts. */
export interface AppointmentDetail extends Appointment {
  startsAt: string;
  durationMinutes: number;
}
