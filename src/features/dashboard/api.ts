import { adminFetch } from "@/lib/api/admin";
import type { DashboardSummary } from "./types";

export function getDashboardSummary(): Promise<DashboardSummary> {
  return adminFetch("/admin/dashboard");
}
