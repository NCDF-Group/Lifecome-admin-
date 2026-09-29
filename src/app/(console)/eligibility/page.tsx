import { ShieldQuestion } from "lucide-react";
import { listEligibilityChecks } from "@/features/eligibility/api";
import { EligibilityTable } from "@/features/eligibility/components/eligibility-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function EligibilityPage() {
  const { items: checks } = await listEligibilityChecks({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldQuestion} title="Eligibility checks" />
      <EligibilityTable checks={checks} />
    </div>
  );
}
