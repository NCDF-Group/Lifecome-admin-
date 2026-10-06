import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getBooking } from "@/features/bookings/api";
import { AppointmentInfoCard, IntakeCard } from "@/features/bookings/components/appointment-info";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await getBooking(bookingId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarDays} title={`Booking - ${booking.patientName}`} />
      <p className="text-sm text-ink-muted">
        With {booking.providerName} ·{" "}
        <Link href="/bookings" className="font-medium text-blue hover:underline">
          Back to all bookings
        </Link>
      </p>
      <AppointmentInfoCard appointment={booking} />
      <IntakeCard appointment={booking} />
    </div>
  );
}
