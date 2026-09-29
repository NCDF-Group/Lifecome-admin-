"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { LocationSummary } from "@/features/locations/types";
import { locationsColumns } from "@/features/locations/components/locations-columns";

export function LocationsTable({
  locations,
}: {
  locations: LocationSummary[];
}) {
  return (
    <DataTable
      columns={locationsColumns}
      data={locations}
      searchPlaceholder="Search by city or state"
    />
  );
}
