"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { formatRelativeTime } from "@/lib/format";
import { topicLabel, type MessageThread } from "./types";

const columns: ColumnDef<MessageThread, unknown>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: (info) => <span className="font-medium text-ink">{info.getValue() as string}</span>,
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: (info) => {
      const topic = info.getValue() as MessageThread["topic"];
      return topic ? topicLabel[topic] : "-";
    },
  },
  {
    accessorKey: "lastMessage",
    header: "Latest message",
    cell: (info) => (
      <span className="line-clamp-1 max-w-md text-ink-muted">{(info.getValue() as string | null) ?? "-"}</span>
    ),
  },
  {
    accessorKey: "lastMessageAt",
    header: "When",
    cell: (info) => {
      const value = info.getValue() as string | null;
      return value ? formatRelativeTime(value) : "-";
    },
  },
];

export function ThreadsTable({ threads }: { threads: MessageThread[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={threads}
      searchPlaceholder="Search by patient or message"
      onRowClick={(thread) => router.push(`/messaging/${thread.id}`)}
    />
  );
}
