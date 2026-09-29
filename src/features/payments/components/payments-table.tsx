"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { PaymentTransaction } from "@/features/payments/types";
import { paymentsColumns } from "@/features/payments/components/payments-columns";

export function PaymentsTable({ transactions }: { transactions: PaymentTransaction[] }) {
  return (
    <DataTable
      columns={paymentsColumns}
      data={transactions}
      searchPlaceholder="Search payments by patient or reference"
    />
  );
}
