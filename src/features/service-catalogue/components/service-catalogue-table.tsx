"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { ClinicalService } from "@/features/service-catalogue/types";
import { serviceCatalogueColumns } from "@/features/service-catalogue/components/service-catalogue-columns";

export function ServiceCatalogueTable({ services }: { services: ClinicalService[] }) {
  return <DataTable columns={serviceCatalogueColumns} data={services} searchPlaceholder="Search services" />;
}
