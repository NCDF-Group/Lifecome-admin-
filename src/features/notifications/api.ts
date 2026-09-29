import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { NotificationChannel, NotificationDeliveryStatus, NotificationLog } from "./types";

export function listNotificationLogs(
  params: { page?: number; pageSize?: number; channel?: NotificationChannel; status?: NotificationDeliveryStatus } = {},
): Promise<PaginatedResult<NotificationLog>> {
  return adminFetch(`/admin/notifications${toQueryString(params)}`);
}
