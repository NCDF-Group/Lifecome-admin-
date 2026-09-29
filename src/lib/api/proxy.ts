import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { getSession } from "@/lib/auth/session";

/**
 * Forwards a browser request to a guarded backend route with the staff bearer token attached -
 * the token lives in an httpOnly cookie the browser can't read. Errors come back as
 * `{ error: string }` so client forms can show the backend's patient-safe message as-is.
 */
export async function proxyToBackend(
  request: Request,
  path: string,
  { method, fallbackError }: { method: "POST" | "PATCH" | "PUT" | "DELETE"; fallbackError: string },
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body: unknown = method === "DELETE" ? undefined : await request.json().catch(() => null);

  const backendResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${session.token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (backendResponse.status === 204) {
    return NextResponse.json({ ok: true });
  }

  const responseBody: unknown = await backendResponse.json().catch(() => undefined);

  if (!backendResponse.ok) {
    const message =
      (responseBody as { error?: { message?: string } } | undefined)?.error?.message ?? fallbackError;
    return NextResponse.json({ error: message }, { status: backendResponse.status });
  }

  return NextResponse.json(responseBody ?? { ok: true });
}
