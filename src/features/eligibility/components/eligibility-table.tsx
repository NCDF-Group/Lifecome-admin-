"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { EligibilityCheck } from "@/features/eligibility/types";
import { eligibilityColumns } from "@/features/eligibility/components/eligibility-columns";

export function EligibilityTable({ checks }: { checks: EligibilityCheck[] }) {
  return (
    <DataTable columns={eligibilityColumns} data={checks} searchPlaceholder="Search by patient or payer" />
  );
}
