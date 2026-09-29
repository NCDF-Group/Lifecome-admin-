import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentStatus, PaymentTransaction } from "@/features/payments/types";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel: Record<PaymentStatus, string> = {
  initiated: "Initiated",
  pending: "Pending",
  successful: "Successful",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

const statusTone: Record<PaymentStatus, "success" | "warning" | "destructive" | "neutral"> = {
  initiated: "neutral",
  pending: "warning",
  successful: "success",
  failed: "destructive",
  cancelled: "neutral",
  refunded: "neutral",
  partially_refunded: "warning",
};

export const paymentsColumns: ColumnDef<PaymentTransaction, unknown>[] = [
  {
    id: "reference",
    header: "Reference",
    accessorFn: (row) => row.receiptNumber ?? row.gatewayReference ?? row.id,
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "serviceName", header: "Service" },
  { accessorKey: "gateway", header: "Method" },
  {
    accessorKey: "amountKobo",
    header: "Amount",
    cell: (info) => `₦${((info.getValue() as number) / 100).toLocaleString("en-NG")}`,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as PaymentStatus;
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
