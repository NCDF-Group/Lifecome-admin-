import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProvider } from "@/features/providers/api";
import { ApiError } from "@/lib/api/admin";
import { Avatar } from "@/components/shared/avatar";
import { StatusPill } from "@/components/shared/status-pill";

const statusLabel = {
  active: "Active",
  suspended: "Suspended",
  pending_review: "Pending review",
} as const;

const statusTone = {
  active: "success",
  suspended: "destructive",
  pending_review: "warning",
} as const;

export default async function ProviderDetailPage({
  params,
}: PageProps<"/providers/[providerId]">) {
  const { providerId } = await params;

  const provider = await getProvider(providerId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <Link href="/providers" className="flex items-center gap-1 text-sm font-medium text-blue">
          <ChevronLeft className="size-4" />
          Providers
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={provider.displayName} size={44} />
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{provider.displayName}</h1>
            <p className="text-sm text-ink-muted">{provider.specialty}</p>
          </div>
        </div>
        <StatusPill tone={statusTone[provider.networkStatus]} label={statusLabel[provider.networkStatus]} />
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-card border border-line bg-card p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Consultation modes</dt>
          <dd className="mt-1 font-medium text-ink">{provider.consultationModes.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Languages</dt>
          <dd className="mt-1 font-medium text-ink">
            {provider.languages.length > 0 ? provider.languages.join(", ") : "Not specified"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Hub location</dt>
          <dd className="mt-1 font-medium text-ink">
            {provider.city && provider.state ? `${provider.city}, ${provider.state}` : "Virtual only"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Joined network</dt>
          <dd className="mt-1 font-medium text-ink">
            {new Date(provider.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Provider ID</dt>
          <dd className="mt-1 font-mono text-xs text-ink">{provider.id}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          title="Not wired up yet - PATCH /admin/providers/:id/network-status exists on the backend; this button doesn't call it yet"
          className="rounded-control border border-line px-4 py-2 text-sm font-semibold text-ink opacity-50 disabled:cursor-not-allowed"
        >
          Change network status
        </button>
      </div>

      <div className="rounded-card border border-dashed border-line p-5 text-sm text-ink-muted">
        Availability, consultation history and credential documents for this provider go here once
        `scheduling`, `consultation` and `documents` gain admin endpoints - see README.md.
      </div>
    </div>
  );
}
