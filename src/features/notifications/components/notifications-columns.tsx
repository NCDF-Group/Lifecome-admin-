import type { ColumnDef } from "@tanstack/react-table";
import type { NotificationChannel, NotificationDeliveryStatus, NotificationLog } from "@/features/notifications/types";
import { StatusPill } from "@/components/shared/status-pill";

const channelLabel: Record<NotificationChannel, string> = {
  sms: "SMS",
  email: "Email",
  push: "Push",
  in_app: "In-app",
};

const statusLabel: Record<NotificationDeliveryStatus, string> = {
  queued: "Queued",
  sent: "Sent",
  failed: "Failed",
};

const statusTone: Record<NotificationDeliveryStatus, "success" | "warning" | "destructive"> = {
  queued: "warning",
  sent: "success",
  failed: "destructive",
};

export const notificationsColumns: ColumnDef<NotificationLog, unknown>[] = [
  {
    accessorKey: "template",
    header: "Template",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  {
    id: "recipient",
    header: "Recipient",
    accessorFn: (row) => row.recipientEmail ?? row.recipientPhoneNumber,
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: (info) => channelLabel[info.getValue() as NotificationChannel],
  },
  {
    accessorKey: "createdAt",
    header: "Sent",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as NotificationDeliveryStatus;
      return <StatusPill tone={statusTone[status]} label={statusLabel[status]} />;
    },
  },
];
