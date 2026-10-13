"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/** The care-team reply box on a thread. Posts through `/api/messaging/threads/:id/messages`, which
 * attaches the staff token server-side, then refreshes the page so the reply shows in the thread. */
export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    setError(null);
    setSending(true);
    try {
      const response = await fetch(`/api/messaging/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
        setError(data?.error ?? "Could not send the reply.");
        return;
      }
      setBody("");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-card border border-line bg-card p-4">
      <label htmlFor="reply-body" className="text-sm font-medium text-ink">
        Reply as the care team
      </label>
      <textarea
        id="reply-body"
        required
        rows={3}
        maxLength={4000}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue/30"
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending || !body.trim()}
        className="flex items-center gap-2 self-end rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" />
        {sending ? "Sending..." : "Send reply"}
      </button>
    </form>
  );
}
