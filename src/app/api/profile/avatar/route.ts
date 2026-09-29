import type { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies `PUT /admin/staff/me/avatar` (upload or replace the signed-in staff member's photo). */
export function PUT(request: Request): Promise<NextResponse> {
  return proxyToBackend(request, "/admin/staff/me/avatar", {
    method: "PUT",
    fallbackError: "Could not update your photo.",
  });
}

/** Proxies `DELETE /admin/staff/me/avatar`. */
export function DELETE(request: Request): Promise<NextResponse> {
  return proxyToBackend(request, "/admin/staff/me/avatar", {
    method: "DELETE",
    fallbackError: "Could not remove your photo.",
  });
}
