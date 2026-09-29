import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

interface LoginResponseBody {
  accessToken: string;
  expiresIn: number;
}

/**
 * Proxies to `POST /admin/auth/login` and stores the returned JWT in an httpOnly cookie - the
 * backend hands back a bearer token, not a cookie itself, so this route is what turns that into a
 * session a server component can read via `lib/auth/session.ts`.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as Record<string, unknown>).email !== "string" ||
    typeof (body as Record<string, unknown>).password !== "string"
  ) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const backendResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    const errorBody = (await backendResponse.json().catch(() => undefined)) as
      | { error?: { message?: string } }
      | undefined;
    return NextResponse.json(
      { error: errorBody?.error?.message ?? "Sign in failed." },
      { status: backendResponse.status },
    );
  }

  const data = (await backendResponse.json()) as LoginResponseBody;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.expiresIn,
  });
  return response;
}
