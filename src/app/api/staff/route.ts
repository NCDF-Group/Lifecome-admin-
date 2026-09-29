import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSession } from "@/lib/auth/session";

/**
 * Proxies to `POST /admin/staff` (platform_administrator only). A route handler, not a direct
 * client-side call, because the staff bearer token lives in an httpOnly cookie the browser can't
 * read - this is what attaches it server-side, the same pattern as `/api/auth/login`.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);

  const backendResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/admin/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(body),
  });

  const responseBody: unknown = await backendResponse.json().catch(() => undefined);

  if (!backendResponse.ok) {
    const message =
      (responseBody as { error?: { message?: string } } | undefined)?.error?.message ??
      "Could not create the staff account.";
    return NextResponse.json({ error: message }, { status: backendResponse.status });
  }

  return NextResponse.json(responseBody);
}
