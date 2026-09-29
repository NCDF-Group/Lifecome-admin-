"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { StaffMember } from "@/features/staff/types";
import { staffColumns } from "@/features/staff/components/staff-columns";

export function StaffTable({ staff }: { staff: StaffMember[] }) {
  return <DataTable columns={staffColumns} data={staff} searchPlaceholder="Search staff by name or email" />;
}
