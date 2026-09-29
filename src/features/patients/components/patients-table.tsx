"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import type { Patient } from "@/features/patients/types";
import { patientsColumns } from "@/features/patients/components/patients-columns";

export function PatientsTable({ patients }: { patients: Patient[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={patientsColumns}
      data={patients}
      searchPlaceholder="Search patients by name, email or phone"
      onRowClick={(patient) => router.push(`/patients/${patient.id}`)}
    />
  );
}
