"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { Provider } from "@/features/providers/types";
import { providersColumns } from "@/features/providers/components/providers-columns";

export function ProvidersTable({ providers }: { providers: Provider[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={providersColumns}
      data={providers}
      searchPlaceholder="Search providers by name or specialty"
      onRowClick={(provider) => router.push(`/providers/${provider.id}`)}
    />
  );
}
