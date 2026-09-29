// Mirrors Lifecome-backend's `auditEvents` table (src/db/schema/audit.schema.ts).
export type ActorType = "patient" | "provider" | "staff" | "system";

export type AuditAction =
  | "record_viewed"
  | "record_downloaded"
  | "record_shared"
  | "clinical_note_signed"
  | "clinical_note_amended"
  | "payer_decision"
  | "payment_state_change"
  | "admin_action";

export interface AuditEvent {
  id: string;
  actorType: ActorType;
  actorId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  correlationId: string | null;
  metadata: Record<string, unknown>;
  occurredAt: string;
}
