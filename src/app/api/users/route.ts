import { json, requireApiUser, route } from "@/lib/api";
import { listUsers } from "@/lib/users";

export const GET = route(async (req) => {
  requireApiUser(req, ["superadmin"]);
  return json({ users: listUsers() });
});
