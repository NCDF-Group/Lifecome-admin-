import type { ColumnDef } from "@tanstack/react-table";
import type { Patient } from "@/features/patients/types";
import { Avatar } from "@/components/shared/avatar";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<Patient["accountStatus"], string> = {
  pending_verification: "Pending verification",
  active: "Active",
  suspended: "Suspended",
  closed: "Closed",
};

const statusTone: Record<Patient["accountStatus"], "success" | "warning" | "destructive" | "neutral"> = {
  pending_verification: "warning",
  active: "success",
  suspended: "destructive",
  closed: "neutral",
};

export const patientsColumns: ColumnDef<Patient, unknown>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={info.getValue() as string} size={30} />
        <span className="font-medium text-ink">{info.getValue() as string}</span>
      </div>
    ),
  },
  { accessorKey: "email", header: "Email", cell: (info) => (info.getValue() as string | null) ?? "-" },
  { accessorKey: "phoneNumber", header: "Phone" },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) => (row.city && row.state ? `${row.city}, ${row.state}` : "-"),
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "accountStatus",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as Patient["accountStatus"];
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
