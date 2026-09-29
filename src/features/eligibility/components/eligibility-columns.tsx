import type { ColumnDef } from "@tanstack/react-table";
import type { EligibilityCheck, EligibilityStatus } from "@/features/eligibility/types";
import { StatusPill } from "@/components/shared/status-pill";

const resultLabel: Record<EligibilityStatus, string> = {
  covered: "Covered",
  co_pay: "Co-pay",
  pre_authorisation_required: "Pre-authorisation required",
  excluded: "Excluded",
  benefit_limit_reached: "Benefit limit reached",
  payer_unavailable: "Payer unavailable",
};

const resultTone: Record<EligibilityStatus, "success" | "warning" | "destructive"> = {
  covered: "success",
  co_pay: "warning",
  pre_authorisation_required: "warning",
  excluded: "destructive",
  benefit_limit_reached: "destructive",
  payer_unavailable: "destructive",
};

export const eligibilityColumns: ColumnDef<EligibilityCheck, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "payerName", header: "Payer" },
  { accessorKey: "serviceName", header: "Service" },
  {
    accessorKey: "checkedAt",
    header: "Checked",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "coPayKobo",
    header: "Co-pay",
    cell: (info) => {
      const value = info.getValue() as string | null;
      return value ? `₦${(Number(value) / 100).toLocaleString("en-NG")}` : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Result",
    cell: (info) => {
      const status = info.getValue() as EligibilityStatus;
      return <StatusPill tone={resultTone[status]} label={resultLabel[status]} />;
    },
  },
];
