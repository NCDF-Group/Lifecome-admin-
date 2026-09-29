import { MapPin, ShieldAlert } from "lucide-react";
import { getLocationsOverview } from "@/features/locations/api";
import { LocationsTable } from "@/features/locations/components/locations-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function LocationsPage() {
  const { locations, unregistered } = await getLocationsOverview();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={MapPin} title="Locations" />

      <div className="flex items-start gap-3 rounded-card border border-line bg-surface p-4 text-sm text-ink-muted">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
        <p>
          This is each person&apos;s registered city and state (the same
          optional field Lifecome-mobile collects at signup), not a live
          device location. Lifecome-backend has no location-tracking
          endpoint, and this console does not request one - see README.md
          &quot;Locations, not tracking&quot;.
        </p>
      </div>

      <LocationsTable locations={locations} />

      {(unregistered.patients > 0 || unregistered.providers > 0) && (
        <p className="text-xs text-ink-muted">
          {unregistered.patients} patient(s) and {unregistered.providers}{" "}
          provider(s) have no registered city and are not shown above.
        </p>
      )}
    </div>
  );
}
