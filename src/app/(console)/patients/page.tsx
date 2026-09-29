import { Users } from "lucide-react";
import { listPatients } from "@/features/patients/api";
import { PatientsTable } from "@/features/patients/components/patients-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function PatientsPage() {
  const { items: patients } = await listPatients({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Users} title="Patients" />
      <PatientsTable patients={patients} />
    </div>
  );
}
