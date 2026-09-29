import type { ColumnDef } from "@tanstack/react-table";
import type { ConsentRecord, ConsentType } from "@/features/consent/types";
import { StatusPill } from "@/components/shared/status-pill";

const typeLabel: Record<ConsentType, string> = {
  terms_of_use: "Terms of use",
  privacy_notice: "Privacy notice",
  clinical_treatment: "Clinical treatment",
  record_sharing: "Record sharing",
};

export const consentColumns: ColumnDef<ConsentRecord, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  {
    accessorKey: "consentType",
    header: "Type",
    cell: (info) => typeLabel[info.getValue() as ConsentType],
  },
  { accessorKey: "documentVersion", header: "Version" },
  { accessorKey: "channel", header: "Channel" },
  {
    accessorKey: "grantedAt",
    header: "Granted",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "revokedAt",
    header: "Status",
    cell: (info) => {
      const revoked = Boolean(info.getValue());
      return <StatusPill tone={revoked ? "neutral" : "success"} label={revoked ? "Revoked" : "Active"} />;
    },
  },
];
