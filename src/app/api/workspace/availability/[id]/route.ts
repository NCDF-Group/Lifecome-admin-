import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies to `DELETE /clinician/availability/:id` - remove one of the doctor's own unbooked times. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(request, `/clinician/availability/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Could not remove that time.",
  });
}
