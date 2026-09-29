import type { ColumnDef } from "@tanstack/react-table";
import type { NetworkStatus, Provider } from "@/features/providers/types";
import { Avatar } from "@/components/shared/avatar";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<NetworkStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  pending_review: "Pending review",
};

const statusTone: Record<NetworkStatus, "success" | "warning" | "destructive"> = {
  active: "success",
  suspended: "destructive",
  pending_review: "warning",
};

export const providersColumns: ColumnDef<Provider, unknown>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={info.getValue() as string} size={30} />
        <span className="font-medium text-ink">{info.getValue() as string}</span>
      </div>
    ),
  },
  { accessorKey: "specialty", header: "Specialty" },
  {
    accessorKey: "consultationModes",
    header: "Modes",
    cell: (info) => (info.getValue() as string[]).join(", "),
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) => (row.city && row.state ? `${row.city}, ${row.state}` : "Virtual only"),
  },
  {
    accessorKey: "networkStatus",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as NetworkStatus;
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
