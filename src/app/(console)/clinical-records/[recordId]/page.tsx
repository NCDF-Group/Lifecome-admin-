import { FileText } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function ClinicalRecordDetailPage() {
  return (
    <PagePlaceholder
      icon={FileText}
      title="Clinical record detail"
      description="One clinical record's full content and who has accessed it."
    />
  );
}
