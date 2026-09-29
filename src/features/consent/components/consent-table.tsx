"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { ConsentRecord } from "@/features/consent/types";
import { consentColumns } from "@/features/consent/components/consent-columns";

export function ConsentTable({ grants }: { grants: ConsentRecord[] }) {
  return <DataTable columns={consentColumns} data={grants} searchPlaceholder="Search by patient" />;
}
