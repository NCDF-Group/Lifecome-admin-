"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { Appointment } from "@/features/bookings/types";
import { bookingsColumns } from "@/features/bookings/components/bookings-columns";

export function BookingsTable({ bookings }: { bookings: Appointment[] }) {
  return (
    <DataTable
      columns={bookingsColumns}
      data={bookings}
      searchPlaceholder="Search bookings by patient or provider"
    />
  );
}
