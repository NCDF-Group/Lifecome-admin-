import { CalendarClock } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function SchedulingPage() {
  return (
    <PagePlaceholder
      icon={CalendarClock}
      title="Scheduling"
      description="Provider availability and calendar management across the network."
    />
  );
}
