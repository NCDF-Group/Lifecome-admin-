import { HeartPulse } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function CareCoordinationPage() {
  return (
    <PagePlaceholder
      icon={HeartPulse}
      title="Care coordination"
      description="Follow-up tasks, case status and care-team coordination across active care plans."
    />
  );
}
