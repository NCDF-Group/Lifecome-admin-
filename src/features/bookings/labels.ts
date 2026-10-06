import type { BookingStatus, ConsultationMode, FundingRoute } from "./types";

export const bookingStatusLabel: Record<BookingStatus, string> = {
  slot_held: "Slot held",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  doctor_unavailable: "Doctor unavailable",
  patient_no_show: "Patient no-show",
};

export const bookingStatusTone: Record<
  BookingStatus,
  "success" | "warning" | "destructive" | "neutral"
> = {
  slot_held: "warning",
  confirmed: "success",
  rescheduled: "warning",
  cancelled: "destructive",
  doctor_unavailable: "destructive",
  patient_no_show: "neutral",
};

export const consultationModeLabel: Record<ConsultationMode, string> = {
  video: "Online (video)",
  audio: "Online (audio)",
  in_person: "In person",
};

export const fundingRouteLabel: Record<FundingRoute, string> = {
  pay_per_visit: "Pay per visit",
  lifecome_benefits: "LifeCome Benefits",
  workplace: "Workplace or Community",
  membership: "Optional Membership",
};

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

/** "Mon, 12 Oct 2026, 10:30" in West Africa Time - the console's one display zone. */
export function formatAppointmentTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

const dayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" });

/** The calendar day (YYYY-MM-DD) in West Africa Time. */
export function dayKey(iso: string | Date): string {
  return dayFormat.format(typeof iso === "string" ? new Date(iso) : iso);
}
