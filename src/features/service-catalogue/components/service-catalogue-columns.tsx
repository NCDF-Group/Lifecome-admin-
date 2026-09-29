import type { ColumnDef } from "@tanstack/react-table";
import type { ClinicalService } from "@/features/service-catalogue/types";
import { StatusPill } from "@/components/shared/status-pill";

export const serviceCatalogueColumns: ColumnDef<ClinicalService, unknown>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => (info.getValue() as string | null) ?? "-",
  },
  {
    accessorKey: "basePriceKobo",
    header: "Price",
    cell: (info) => `₦${((info.getValue() as number) / 100).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "defaultDurationMinutes",
    header: "Duration",
    cell: (info) => `${info.getValue() as number} min`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info) => (
      <StatusPill tone={info.getValue() ? "success" : "neutral"} label={info.getValue() ? "Active" : "Inactive"} />
    ),
  },
];
