import type { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import type { LocationSummary } from "@/features/locations/types";

export const locationsColumns: ColumnDef<LocationSummary, unknown>[] = [
  {
    accessorKey: "city",
    header: "City",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-blue" />
        <span className="font-medium text-ink">
          {info.getValue() as string}
        </span>
      </div>
    ),
  },
  { accessorKey: "state", header: "State" },
  { accessorKey: "patientCount", header: "Patients" },
  { accessorKey: "providerCount", header: "Providers" },
  {
    id: "total",
    header: "Total registered",
    cell: (info) => {
      const row = info.row.original;
      return row.patientCount + row.providerCount;
    },
  },
];
