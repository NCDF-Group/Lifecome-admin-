import type { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies to `POST /admin/staff/me/password`. */
export function POST(request: Request): Promise<NextResponse> {
  return proxyToBackend(request, "/admin/staff/me/password", {
    method: "POST",
    fallbackError: "Could not change your password.",
  });
}
