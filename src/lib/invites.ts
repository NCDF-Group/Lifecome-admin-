import { db, audit } from "./db/index.ts";
import { hashPassword, normaliseEmail, randomId, randomToken, sha256, validatePassword } from "./security.ts";
import { INVITABLE_ROLES, isRole, type RoleKey } from "./roles.ts";
import { AuthError, createSessionFor } from "./auth/core.ts";

export const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";

export interface InviteRow {
  id: string;
  email: string;
  name: string | null;
  role: RoleKey;
  invited_by: string;
  invited_by_name: string | null;
  created_at: number;
  expires_at: number;
  emailed_at: number | null;
  accepted_at: number | null;
  revoked_at: number | null;
  status: InviteStatus;
}

interface Actor {
  id: string;
  email: string;
}

function statusOf(row: { accepted_at: number | null; revoked_at: number | null; expires_at: number }): InviteStatus {
  if (row.accepted_at) return "accepted";
  if (row.revoked_at) return "revoked";
  return row.expires_at <= Date.now() ? "expired" : "pending";
}

export function createInvite(input: { email?: unknown; role?: unknown; name?: unknown }, actor: Actor) {
  const email = normaliseEmail(input.email);
  if (!email) throw new AuthError("Enter a valid email address.", 400);
  if (!isRole(input.role) || !INVITABLE_ROLES.some((r) => r.key === input.role)) throw new AuthError("Choose a role from the list.", 400);
  const name = typeof input.name === "string" && input.name.trim() ? input.name.trim().slice(0, 120) : null;
  if (db().prepare("SELECT 1 FROM users WHERE email = ?").get(email)) throw new AuthError("A team member with this email already exists.", 409);

  const now = Date.now();
  // A newer invite supersedes any pending one for the same address.
  db().prepare("UPDATE invites SET revoked_at = ? WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL").run(now, email);
  const token = randomToken();
  const id = randomId();
  db()
    .prepare("INSERT INTO invites (id, email, name, role, token_hash, invited_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, email, name, input.role, sha256(token), actor.id, now, now + INVITE_TTL_MS);
  audit(actor, "invite.created", email, { role: input.role });
  return { id, token, email, role: input.role as RoleKey, name };
}

export function listInvites(): InviteRow[] {
  const rows = db()
    .prepare(
      `SELECT i.id, i.email, i.name, i.role, i.invited_by, u.name AS invited_by_name, i.created_at, i.expires_at, i.emailed_at, i.accepted_at, i.revoked_at
       FROM invites i LEFT JOIN users u ON u.id = i.invited_by ORDER BY i.created_at DESC`,
    )
    .all() as unknown as Omit<InviteRow, "status">[];
  return rows.map((r) => ({ ...r, status: statusOf(r) }));
}

export function markEmailed(id: string) {
  db().prepare("UPDATE invites SET emailed_at = ? WHERE id = ?").run(Date.now(), id);
}

export function revokeInvite(id: string, actor: Actor) {
  const row = db().prepare("SELECT email, accepted_at, revoked_at FROM invites WHERE id = ?").get(id) as unknown as { email: string; accepted_at: number | null; revoked_at: number | null } | undefined;
  if (!row) throw new AuthError("Invite not found.", 404);
  if (row.accepted_at) throw new AuthError("This invite has already been accepted.", 409);
  db().prepare("UPDATE invites SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL").run(Date.now(), id);
  audit(actor, "invite.revoked", row.email);
}

/** Issues a fresh link (tokens are stored hashed, so the old link cannot be shown again). */
export function reissueInvite(id: string, actor: Actor) {
  const row = db().prepare("SELECT email, name, role, accepted_at FROM invites WHERE id = ?").get(id) as unknown as { email: string; name: string | null; role: RoleKey; accepted_at: number | null } | undefined;
  if (!row) throw new AuthError("Invite not found.", 404);
  if (row.accepted_at) throw new AuthError("This invite has already been accepted.", 409);
  const created = createInvite({ email: row.email, role: row.role, name: row.name }, actor);
  audit(actor, "invite.resent", row.email, { role: row.role });
  return created;
}

export interface InvitePreview {
  email: string;
  name: string | null;
  role: RoleKey;
  invitedBy: string | null;
  expiresAt: number;
}

export function previewInvite(token: string): { ok: true; invite: InvitePreview } | { ok: false; reason: "invalid" | "expired" | "revoked" | "accepted" } {
  const row = db()
    .prepare(
      `SELECT i.email, i.name, i.role, i.expires_at, i.accepted_at, i.revoked_at, u.name AS invited_by_name
       FROM invites i LEFT JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?`,
    )
    .get(sha256(token)) as unknown as { email: string; name: string | null; role: RoleKey; expires_at: number; accepted_at: number | null; revoked_at: number | null; invited_by_name: string | null } | undefined;
  if (!row) return { ok: false, reason: "invalid" };
  const status = statusOf(row);
  if (status !== "pending") return { ok: false, reason: status };
  return { ok: true, invite: { email: row.email, name: row.name, role: row.role, invitedBy: row.invited_by_name, expiresAt: row.expires_at } };
}

export function acceptInvite(token: string, input: { name: unknown; password: unknown }, meta: { ip?: string; userAgent?: string } = {}) {
  const preview = previewInvite(token);
  if (!preview.ok) throw new AuthError("This invite link is no longer valid.", 410);
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 120) : "";
  if (name.length < 2) throw new AuthError("Enter your full name.", 400);
  const passwordError = validatePassword(input.password);
  if (passwordError) throw new AuthError(passwordError, 400);

  const database = db();
  const { invite } = preview;
  const userId = randomId();
  const now = Date.now();
  database.exec("BEGIN IMMEDIATE");
  try {
    const claimed = database
      .prepare("UPDATE invites SET accepted_at = ?, accepted_user_id = ? WHERE token_hash = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?")
      .run(now, userId, sha256(token), now);
    if (claimed.changes !== 1) throw new AuthError("This invite link is no longer valid.", 410);
    if (database.prepare("SELECT 1 FROM users WHERE email = ?").get(invite.email)) throw new AuthError("An account with this email already exists.", 409);
    const inviter = database.prepare("SELECT invited_by FROM invites WHERE token_hash = ?").get(sha256(token)) as unknown as { invited_by: string };
    database
      .prepare("INSERT INTO users (id, email, name, password_hash, role, status, created_at, invited_by) VALUES (?, ?, ?, ?, ?, 'active', ?, ?)")
      .run(userId, invite.email, name, hashPassword(input.password as string), invite.role, now, inviter.invited_by);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  audit({ id: userId, email: invite.email }, "invite.accepted", invite.email, { role: invite.role });
  const sessionToken = createSessionFor(userId, meta);
  audit({ id: userId, email: invite.email }, "auth.login", invite.email);
  return { token: sessionToken, user: { id: userId, email: invite.email, name, role: invite.role } };
}
