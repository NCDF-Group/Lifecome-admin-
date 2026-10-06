import { StatusPill } from "@/components/shared/status-pill";
import {
  bookingStatusLabel,
  bookingStatusTone,
  consultationModeLabel,
  formatAppointmentTime,
  fundingRouteLabel,
} from "@/features/bookings/labels";
import type { AppointmentIntake, BookingStatus, ConsultationMode, FundingRoute } from "@/features/bookings/types";

/** The fields both the admin booking page and the clinician's appointment page show. */
export interface AppointmentInfoData {
  startsAt: string;
  durationMinutes: number;
  status: BookingStatus;
  consultationMode: ConsultationMode;
  locationCity: string | null;
  clinicName: string | null;
  fundingRoute: FundingRoute;
  serviceName: string;
  presentingConcern: string | null;
  intake: AppointmentIntake | null;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm font-medium text-ink">
        {value && value.trim() ? value : <span className="font-normal text-ink-muted">Not provided</span>}
      </dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-card p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

/** When, how and how it's funded. */
export function AppointmentInfoCard({ appointment }: { appointment: AppointmentInfoData }) {
  const inPerson = appointment.consultationMode === "in_person";
  return (
    <Card title="Appointment">
      <Field label="When" value={formatAppointmentTime(appointment.startsAt)} />
      <Field label="Duration" value={`${appointment.durationMinutes} minutes`} />
      <Field label="Service" value={appointment.serviceName} />
      <Field label="Mode" value={consultationModeLabel[appointment.consultationMode]} />
      {inPerson && (
        <Field
          label="Clinic"
          value={[appointment.clinicName, appointment.locationCity].filter(Boolean).join(", ")}
        />
      )}
      <Field label="Funding" value={fundingRouteLabel[appointment.fundingRoute]} />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Status</dt>
        <dd className="mt-1">
          <StatusPill
            tone={bookingStatusTone[appointment.status]}
            label={bookingStatusLabel[appointment.status]}
          />
        </dd>
      </div>
    </Card>
  );
}

/** What the patient filled in on the app's "Prepare for ..." screen. */
export function IntakeCard({ appointment }: { appointment: AppointmentInfoData }) {
  const intake = appointment.intake ?? {};
  const inPerson = appointment.consultationMode === "in_person";
  return (
    <Card title={inPerson ? "Prepared for clinic visit" : "Prepared for online care"}>
      <Field label="Reason for visit" value={intake.reason ?? appointment.presentingConcern} />
      <Field label="Medicines and allergies" value={intake.medicinesAndAllergies} />
      {inPerson ? (
        <Field label="Accessibility support" value={intake.accessibilitySupport} />
      ) : (
        <>
          <Field label="Patient's location during the appointment" value={intake.patientLocation} />
          <Field label="Callback number" value={intake.callbackNumber} />
          <Field
            label="Understands limits of remote assessment"
            value={intake.understoodRemoteLimits === undefined ? null : intake.understoodRemoteLimits ? "Yes" : "No"}
          />
        </>
      )}
    </Card>
  );
}
