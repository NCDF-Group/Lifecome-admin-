import { ShieldAlert } from "lucide-react";
import { listAuditEvents } from "@/features/audit/api";
import { AuditTable } from "@/features/audit/components/audit-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function AuditPage() {
  const { items: events } = await listAuditEvents({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldAlert} title="Audit log" />
      <AuditTable events={events} />
    </div>
  );
}
