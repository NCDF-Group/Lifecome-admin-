import { CalendarDays } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function BookingDetailPage() {
  return (
    <PagePlaceholder
      icon={CalendarDays}
      title="Booking detail"
      description="One booking's full timeline: service, slot, payer authorisation and payment status."
    />
  );
}
