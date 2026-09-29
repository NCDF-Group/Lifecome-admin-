import { Video } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function ConsultationsPage() {
  return (
    <PagePlaceholder
      icon={Video}
      title="Consultations"
      description="Live and past video/audio consultation sessions, with connection quality and duration."
    />
  );
}
