import { CalendarCheck, CalendarClock, MapPin, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { dayKey } from "@/features/bookings/labels";
import { AgendaTable } from "@/features/workspace/components/agenda-table";
import { getClinicianProfile, listClinicianAppointments } from "@/features/workspace/api";

export default async function WorkspacePage() {
  const [{ provider }, upcoming] = await Promise.all([
    getClinicianProfile(),
    listClinicianAppointments({ scope: "upcoming", pageSize: 100 }),
  ]);

  const today = dayKey(new Date());
  const items = upcoming.items;
  const todayCount = items.filter((item) => dayKey(item.startsAt) === today).length;
  const inPerson = items.filter((item) => item.consultationMode === "in_person").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CalendarCheck} title="My agenda" />
      <p className="text-sm text-ink-muted">
        {provider.displayName} · {provider.specialty}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today" value={String(todayCount)} icon={CalendarCheck} />
        <StatCard label="Upcoming" value={String(upcoming.total)} icon={CalendarClock} />
        <StatCard label="Online" value={String(items.length - inPerson)} icon={Video} />
        <StatCard label="In person" value={String(inPerson)} icon={MapPin} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink">Upcoming appointments</h2>
        <AgendaTable appointments={items} />
      </section>
    </div>
  );
}
