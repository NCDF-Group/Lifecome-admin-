import { body, json, requireApiUser, route } from "@/lib/api";
import { reissueInvite, revokeInvite } from "@/lib/invites";
import { deliver } from "@/lib/invite-delivery";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE revokes the invite (and removes an account that was never activated). */
export const DELETE = route<Ctx>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  revokeInvite((await ctx.params).id, actor);
  return json({ ok: true });
});

/** POST issues a fresh 2-minute link; the default password is unchanged unless a new one is sent. */
export const POST = route<Ctx>(async (req, ctx) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const { password } = await body<{ password?: unknown }>(req).catch(() => ({ password: undefined }));
  return json(await deliver(req, reissueInvite((await ctx.params).id, actor, password), actor.email), 201);
});
