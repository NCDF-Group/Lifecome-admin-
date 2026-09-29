import { ClipboardCheck } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function AuthorisationsPage() {
  return (
    <PagePlaceholder
      icon={ClipboardCheck}
      title="Authorisations"
      description="Payer authorisation requests and their approval status."
    />
  );
}
