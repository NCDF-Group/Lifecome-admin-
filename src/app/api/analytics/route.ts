import { json, requireApiUser, route } from "@/lib/api";
import { overview } from "@/lib/analytics";

export const GET = route(async (req) => {
  requireApiUser(req, ["superadmin"]);
  const days = Math.min(90, Math.max(7, Number(req.nextUrl.searchParams.get("days")) || 30));
  return json(overview(days));
});
