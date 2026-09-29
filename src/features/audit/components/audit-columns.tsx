import type { ColumnDef } from "@tanstack/react-table";
import type { ActorType, AuditAction, AuditEvent } from "@/features/audit/types";
import { StatusPill } from "@/components/shared/status-pill";

const actorTone: Record<ActorType, "info" | "success" | "warning" | "neutral"> = {
  patient: "info",
  provider: "success",
  staff: "warning",
  system: "neutral",
};

const actionLabel: Record<AuditAction, string> = {
  record_viewed: "Record viewed",
  record_downloaded: "Record downloaded",
  record_shared: "Record shared",
  clinical_note_signed: "Clinical note signed",
  clinical_note_amended: "Clinical note amended",
  payer_decision: "Payer decision",
  payment_state_change: "Payment state change",
  admin_action: "Admin action",
};

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
}

export const auditColumns: ColumnDef<AuditEvent, unknown>[] = [
  {
    accessorKey: "occurredAt",
    header: "When",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "actorType",
    header: "Actor",
    cell: (info) => {
      const actorType = info.getValue() as ActorType;
      const actorId = info.row.original.actorId;
      return (
        <div className="flex items-center gap-2">
          <StatusPill tone={actorTone[actorType]} label={actorType} />
          <span className="font-mono text-xs text-ink-muted">{shortId(actorId)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: (info) => actionLabel[info.getValue() as AuditAction],
  },
  {
    id: "resource",
    header: "Resource",
    cell: (info) => {
      const row = info.row.original;
      return (
        <span>
          {row.resourceType} <span className="font-mono text-xs text-ink-muted">{shortId(row.resourceId)}</span>
        </span>
      );
    },
  },
];
