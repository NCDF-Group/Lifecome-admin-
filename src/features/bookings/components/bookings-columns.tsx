import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment, BookingStatus } from "@/features/bookings/types";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<BookingStatus, string> = {
  slot_held: "Slot held",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  doctor_unavailable: "Doctor unavailable",
  patient_no_show: "Patient no-show",
};

const statusTone: Record<BookingStatus, "success" | "warning" | "destructive" | "neutral"> = {
  slot_held: "warning",
  confirmed: "success",
  rescheduled: "warning",
  cancelled: "destructive",
  doctor_unavailable: "destructive",
  patient_no_show: "neutral",
};

export const bookingsColumns: ColumnDef<Appointment, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "providerName", header: "Provider" },
  { accessorKey: "serviceName", header: "Service" },
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
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
