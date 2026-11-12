import { body, json, requireApiUser, route } from "@/lib/api";
import { deliver } from "@/lib/invite-delivery";
import { createInvite, listInvites } from "@/lib/invites";

export const GET = route(async (req) => {
  requireApiUser(req, ["superadmin"]);
  return json({ invites: listInvites() });
});

export const POST = route(async (req) => {
  const actor = requireApiUser(req, ["superadmin"]);
  const input = await body<{ email?: unknown; role?: unknown; name?: unknown; password?: unknown }>(req);
  return json(await deliver(req, createInvite(input, actor), actor.email), 201);
});
