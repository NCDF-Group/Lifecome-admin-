import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment, BookingStatus } from "@/features/bookings/types";
import {
  bookingStatusLabel,
  bookingStatusTone,
  consultationModeLabel,
  fundingRouteLabel,
} from "@/features/bookings/labels";
import { StatusPill } from "@/components/shared/status-pill";

export const bookingsColumns: ColumnDef<Appointment, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "providerName", header: "Provider" },
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
    accessorKey: "createdAt",
    header: "Booked",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "feeKobo",
    header: "Fee",
    cell: (info) => `₦${((info.getValue() as number) / 100).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as BookingStatus;
      return <StatusPill tone={bookingStatusTone[status]} label={bookingStatusLabel[status]} />;
    },
  },
];
