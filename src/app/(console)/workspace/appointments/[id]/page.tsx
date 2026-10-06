import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentInfoCard, IntakeCard } from "@/features/bookings/components/appointment-info";
import { getClinicianAppointment } from "@/features/workspace/api";

function ageFrom(dateOfBirth: string): number {
  const born = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  if (now < new Date(now.getFullYear(), born.getMonth(), born.getDate())) age -= 1;
  return age;
}

export default async function ClinicianAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getClinicianAppointment(id);
  const { patient } = appointment;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarCheck} title={`${patient.firstName} ${patient.lastName}`} />
      <p className="text-sm text-ink-muted">
        {ageFrom(patient.dateOfBirth)} years old
        {patient.sex ? ` · ${patient.sex}` : ""}
        {patient.city ? ` · ${patient.city}` : ""} ·{" "}
        <Link href="/workspace" className="font-medium text-blue hover:underline">
          Back to agenda
        </Link>
      </p>
      <AppointmentInfoCard appointment={appointment} />
      <IntakeCard appointment={appointment} />
    </div>
  );
}
