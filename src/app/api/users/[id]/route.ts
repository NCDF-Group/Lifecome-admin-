import { body, json, requireApiUser, route } from "@/lib/api";
import { updateUser } from "@/lib/users";

/** Change a team member's role, status, or public profile (name, title, bio, languages, patient-app visibility). */
export const PATCH = route<{ params: Promise<{ id: string }> }>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const { role, status, name, title, bio, languages, showInApp } = await body(req);
  updateUser((await ctx.params).id, { role, status, name, title, bio, languages, showInApp }, actor);
  return json({ ok: true });
});
