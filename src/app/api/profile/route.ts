import type { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies to `PATCH /admin/staff/me` - any signed-in staff member, on their own account only. */
export function PATCH(request: Request): Promise<NextResponse> {
  return proxyToBackend(request, "/admin/staff/me", {
    method: "PATCH",
    fallbackError: "Could not update your profile.",
  });
}
