import { FileText } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function ClinicalRecordsPage() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Clinical records"
      description="Visit summaries, prescriptions and referrals, with review status and access history."
    />
  );
}
