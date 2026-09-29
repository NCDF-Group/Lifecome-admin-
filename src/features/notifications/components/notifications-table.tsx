"use client";

import { DataTable } from "@/components/data-table/data-table";
import type { NotificationLog } from "@/features/notifications/types";
import { notificationsColumns } from "@/features/notifications/components/notifications-columns";

export function NotificationsTable({ notifications }: { notifications: NotificationLog[] }) {
  return (
    <DataTable
      columns={notificationsColumns}
      data={notifications}
      searchPlaceholder="Search notifications by template or recipient"
    />
  );
}
