"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { StatusPill } from "@/components/shared/status-pill";
import {
  bookingStatusLabel,
  bookingStatusTone,
  consultationModeLabel,
  formatAppointmentTime,
  fundingRouteLabel,
} from "@/features/bookings/labels";
import type { ClinicianAppointment } from "../types";

const columns: ColumnDef<ClinicianAppointment, unknown>[] = [
  {
    accessorKey: "startsAt",
    header: "When",
    cell: (info) => (
      <span className="font-medium text-ink">{formatAppointmentTime(info.getValue() as string)}</span>
    ),
  },
  { accessorKey: "patientName", header: "Patient" },
  { accessorKey: "serviceName", header: "Service" },
  {
    accessorKey: "consultationMode",
    header: "Mode",
    cell: (info) => {
      const row = info.row.original;
      const mode = consultationModeLabel[row.consultationMode];
      return row.consultationMode === "in_person" && row.locationCity
        ? `${mode} - ${row.locationCity}`
        : mode;
    },
  },
  {
    accessorKey: "fundingRoute",
    header: "Funding",
    cell: (info) => fundingRouteLabel[info.row.original.fundingRoute],
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.row.original.status;
      return <StatusPill tone={bookingStatusTone[status]} label={bookingStatusLabel[status]} />;
    },
  },
];

/** The doctor's appointments; clicking a row opens the appointment with the patient's intake. */
export function AgendaTable({ appointments }: { appointments: ClinicianAppointment[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={appointments}
      searchPlaceholder="Search by patient or service"
      onRowClick={(appointment) => router.push(`/workspace/appointments/${appointment.id}`)}
    />
  );
}
