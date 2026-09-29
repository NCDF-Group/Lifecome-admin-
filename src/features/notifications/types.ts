// Mirrors Lifecome-backend's `AdminNotificationLogRow` (src/modules/notifications/notifications.service.ts).
export type NotificationChannel = "sms" | "email" | "push" | "in_app";
export type NotificationDeliveryStatus = "queued" | "sent" | "failed";

export interface NotificationLog {
  id: string;
  recipientUserAccountId: string;
  channel: NotificationChannel;
  template: string;
  status: NotificationDeliveryStatus;
  failureReason: string | null;
  createdAt: string;
  recipientPhoneNumber: string;
  recipientEmail: string | null;
}
