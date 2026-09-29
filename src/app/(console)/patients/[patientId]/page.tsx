import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPatient } from "@/features/patients/api";
import { ApiError } from "@/lib/api/admin";
import { Avatar } from "@/components/shared/avatar";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel = {
  pending_verification: "Pending verification",
  active: "Active",
  suspended: "Suspended",
  closed: "Closed",
} as const;

const statusTone = {
  pending_verification: "warning",
  active: "success",
  suspended: "destructive",
  closed: "neutral",
} as const;

export default async function PatientDetailPage({
  params,
}: PageProps<"/patients/[patientId]">) {
  const { patientId } = await params;

  const patient = await getPatient(patientId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Link href="/patients" className="flex items-center gap-1 text-sm font-medium text-blue">
          <ChevronLeft className="size-4" />
          Patients
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} size={44} />
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{fullName}</h1>
            <p className="text-sm text-ink-muted">{patient.email ?? "No email on file"}</p>
          </div>
        </div>
        <StatusPill tone={statusTone[patient.accountStatus]} label={statusLabel[patient.accountStatus]} />
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-card border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Phone</dt>
          <dd className="mt-1 font-medium text-ink">{patient.phoneNumber}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Date of birth</dt>
          <dd className="mt-1 font-medium text-ink">
            {new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Registered location</dt>
          <dd className="mt-1 font-medium text-ink">
            {patient.city && patient.state ? `${patient.city}, ${patient.state}` : "Not provided"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Registered</dt>
          <dd className="mt-1 font-medium text-ink">
            {new Date(patient.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Patient ID</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{patient.id}</dd>
        </div>
      </dl>

      <div className="rounded-card border border-dashed border-line p-5 text-sm text-ink-muted">
        Bookings, clinical records and consent settings for this patient go here once the
        corresponding backend modules gain admin endpoints - see README.md.
      </div>
    </div>
  );
}
