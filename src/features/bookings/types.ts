// Mirrors Lifecome-backend's `AdminAppointmentRow` (src/modules/booking/booking.service.ts).
export type BookingStatus =
  | "slot_held"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "doctor_unavailable"
  | "patient_no_show";

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  clinicalServiceId: string;
  availabilitySlotId: string;
  consultationMode: "video" | "audio";
  status: BookingStatus;
  authorisationId: string | null;
  presentingConcern: string | null;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  providerName: string;
  serviceName: string;
  feeKobo: number;
}
