import { Bell, Send } from "lucide-react";
import { listNotificationLogs } from "@/features/notifications/api";
import { NotificationsTable } from "@/features/notifications/components/notifications-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function NotificationsPage() {
  const { items: notifications } = await listNotificationLogs({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Bell}
        title="Notifications"
        action={
          <button
            type="button"
            disabled
            title="Not wired up yet - needs a backend broadcast endpoint (POST /notifications only enqueues a single recipient today)"
            className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="size-4" />
            Compose broadcast
          </button>
        }
      />
      <NotificationsTable notifications={notifications} />
    </div>
  );
}
