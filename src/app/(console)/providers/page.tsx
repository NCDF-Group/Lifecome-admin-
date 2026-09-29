import { Stethoscope } from "lucide-react";
import { listProviders } from "@/features/providers/api";
import { ProvidersTable } from "@/features/providers/components/providers-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function ProvidersPage() {
  const { items: providers } = await listProviders({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Stethoscope} title="Providers" />
      <ProvidersTable providers={providers} />
    </div>
  );
}
