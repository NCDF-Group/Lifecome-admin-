import type { ColumnDef } from "@tanstack/react-table";
import type { Payer, PayerIntegrationMode } from "@/features/payers/types";
import { StatusPill } from "@/components/shared/status-pill";

const integrationLabel: Record<PayerIntegrationMode, string> = {
  realtime_api: "Realtime API",
  secure_batch_file: "Secure batch file",
  operations_portal: "Operations portal",
  rules_configuration: "Rules configuration",
};

export const payersColumns: ColumnDef<Payer, unknown>[] = [
  {
    accessorKey: "name",
    header: "Payer",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "integrationMode",
    header: "Integration",
    cell: (info) => integrationLabel[info.getValue() as PayerIntegrationMode],
  },
  { accessorKey: "displayOrder", header: "Display order" },
  {
    accessorKey: "isLive",
    header: "Status",
    cell: (info) => (
      <StatusPill tone={info.getValue() ? "success" : "neutral"} label={info.getValue() ? "Live" : "Not live"} />
    ),
  },
];
