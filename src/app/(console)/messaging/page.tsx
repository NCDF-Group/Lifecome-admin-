import { MessagesSquare } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function MessagingPage() {
  return (
    <PagePlaceholder
      icon={MessagesSquare}
      title="Messaging oversight"
      description="Support visibility into patient/care-team message threads, for moderation and escalation."
    />
  );
}
