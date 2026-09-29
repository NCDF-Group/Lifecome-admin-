import { Building2 } from "lucide-react";
import { listPayers } from "@/features/payers/api";
import { PayersTable } from "@/features/payers/components/payers-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function PayersPage() {
  const payers = await listPayers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Building2} title="Payers" />
      <PayersTable payers={payers} />
    </div>
  );
}
