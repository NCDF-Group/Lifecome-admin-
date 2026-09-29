import { ShieldCheck } from "lucide-react";
import { listConsentRecords } from "@/features/consent/api";
import { ConsentTable } from "@/features/consent/components/consent-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function ConsentPage() {
  const { items: grants } = await listConsentRecords({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldCheck} title="Consent records" />
      <ConsentTable grants={grants} />
    </div>
  );
}
