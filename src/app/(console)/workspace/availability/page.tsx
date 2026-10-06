import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { listMySlots } from "@/features/workspace/api";
import { AvailabilityManager } from "@/features/workspace/components/availability-manager";

export default async function AvailabilityPage() {
  const slots = await listMySlots();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarClock} title="My availability" />
      <AvailabilityManager slots={slots} />
    </div>
  );
}
