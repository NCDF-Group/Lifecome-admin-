import { body, json, requireApiUser, route } from "@/lib/api";
import { updateUser } from "@/lib/users";

export const PATCH = route<{ params: Promise<{ id: string }> }>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const { role, status } = await body(req);
  updateUser((await ctx.params).id, { role, status }, actor);
  return json({ ok: true });
});
