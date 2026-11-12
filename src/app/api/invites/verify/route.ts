import { body, json, route } from "@/lib/api";
import { verifyInvite } from "@/lib/invites";

/** Step 1 of accepting an invite: check the link is valid and the default password matches. */
export const POST = route(async (req) => {
  const { token, password } = await body<{ token?: unknown; password?: unknown }>(req);
  if (typeof token !== "string" || !token) return json({ error: "This invite link is no longer valid." }, 410);
  return json(verifyInvite(token, password));
});
