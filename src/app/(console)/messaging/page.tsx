import { MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { listThreads } from "@/features/messaging/api";
import { ThreadsTable } from "@/features/messaging/threads-table";

export default async function MessagingPage() {
  const { items: threads } = await listThreads({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={MessagesSquare} title="Patient messages" />
      <ThreadsTable threads={threads} />
    </div>
  );
}
