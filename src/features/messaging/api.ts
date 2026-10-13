import { adminFetch } from "@/lib/api/admin";
import type { PaginatedResult } from "@/lib/api/pagination";
import { toQueryString } from "@/lib/api/pagination";
import type { MessageThread, MessageThreadDetail, MessageTopic } from "./types";

export function listThreads(
  params: { page?: number; pageSize?: number; topic?: MessageTopic } = {},
): Promise<PaginatedResult<MessageThread>> {
  return adminFetch(`/admin/messaging/threads${toQueryString(params)}`);
}

export function getThread(id: string): Promise<MessageThreadDetail> {
  return adminFetch(`/admin/messaging/threads/${id}`);
}
