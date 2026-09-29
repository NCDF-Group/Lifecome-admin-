import { Video } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function ConsultationDetailPage() {
  return (
    <PagePlaceholder
      icon={Video}
      title="Consultation detail"
      description="One consultation session's timeline, participants and any escalation notes."
    />
  );
}
