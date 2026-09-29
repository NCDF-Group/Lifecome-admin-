"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { AuditEvent } from "@/features/audit/types";
import { auditColumns } from "@/features/audit/components/audit-columns";

export function AuditTable({ events }: { events: AuditEvent[] }) {
  return (
    <DataTable
      columns={auditColumns}
      data={events}
      searchPlaceholder="Search audit events by action or resource"
    />
  );
}
