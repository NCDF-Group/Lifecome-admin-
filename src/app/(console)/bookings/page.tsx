import { CalendarDays } from "lucide-react";
import { listBookings } from "@/features/bookings/api";
import { BookingsTable } from "@/features/bookings/components/bookings-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function BookingsPage() {
  const { items: bookings } = await listBookings({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarDays} title="Bookings" />
      <BookingsTable bookings={bookings} />
    </div>
  );
}
