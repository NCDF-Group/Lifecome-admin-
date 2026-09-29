import { Package } from "lucide-react";
import { listServices } from "@/features/service-catalogue/api";
import { ServiceCatalogueTable } from "@/features/service-catalogue/components/service-catalogue-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function ServiceCataloguePage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Package} title="Service catalogue" />
      <ServiceCatalogueTable services={services} />
    </div>
  );
}
