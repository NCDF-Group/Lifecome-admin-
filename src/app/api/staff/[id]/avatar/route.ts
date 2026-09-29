import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSession } from "@/lib/auth/session";

/** Proxies `GET /admin/staff/:id/avatar` so an <img> can show a staff photo: the backend needs the
 * bearer token, which lives in an httpOnly cookie the browser can't attach itself. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const session = await getSession();
  if (!session) return new NextResponse(null, { status: 401 });

  const { id } = await params;
  const backendResponse = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/admin/staff/${encodeURIComponent(id)}/avatar`,
    { headers: { Authorization: `Bearer ${session.token}` }, cache: "no-store" },
  );
  if (!backendResponse.ok) return new NextResponse(null, { status: backendResponse.status });

  return new Response(backendResponse.body, {
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") ?? "application/octet-stream",
      // The URL carries `?v=<upload time>`, so a cached copy is never stale. `private`: staff-only.
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
