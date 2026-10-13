import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getThread } from "@/features/messaging/api";
import { ReplyForm } from "@/features/messaging/reply-form";
import { topicLabel } from "@/features/messaging/types";
import { cn } from "@/lib/utils";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const thread = await getThread(threadId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={MessagesSquare} title={thread.patientName} />
      <p className="text-sm text-ink-muted">
        {thread.topic ? topicLabel[thread.topic] : (thread.subject ?? "Conversation")} ·{" "}
        <Link href="/messaging" className="font-medium text-blue hover:underline">
          Back to all messages
        </Link>
      </p>

      <ol className="flex flex-col gap-3">
        {thread.messages.map((message) => {
          const fromPatient = message.senderType === "patient";
          return (
            <li key={message.id} className={cn("flex", fromPatient ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-xl rounded-card px-4 py-3 text-sm",
                  fromPatient ? "bg-surface text-ink" : "bg-blue text-white",
                )}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p className={cn("mt-1 text-xs", fromPatient ? "text-ink-muted" : "text-white/80")}>
                  {fromPatient ? thread.patientName : "Care team"} · {timeFormat.format(new Date(message.sentAt))}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <ReplyForm threadId={thread.id} />
    </div>
  );
}
