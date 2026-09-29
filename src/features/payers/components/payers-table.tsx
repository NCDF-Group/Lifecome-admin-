"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { Payer } from "@/features/payers/types";
import { payersColumns } from "@/features/payers/components/payers-columns";

export function PayersTable({ payers }: { payers: Payer[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={payersColumns}
      data={payers}
      searchPlaceholder="Search payers by name"
      onRowClick={(payer) => router.push(`/payers/${payer.id}`)}
    />
  );
}
