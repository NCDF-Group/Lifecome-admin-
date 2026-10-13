import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies to `POST /admin/messaging/threads/:id/messages` - a care-team reply. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(request, `/admin/messaging/threads/${encodeURIComponent(id)}/messages`, {
    method: "POST",
    fallbackError: "Could not send the reply.",
  });
}
