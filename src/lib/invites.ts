import { db, audit } from "./db/index.ts";
import { generatePassword, hashPassword, normaliseEmail, randomId, randomToken, sha256, throttle, validatePassword, verifyPassword } from "./security.ts";
import { INVITABLE_ROLES, isRole, type RoleKey } from "./roles.ts";
import { AuthError, createSessionFor } from "./auth/core.ts";

/** Invite links are deliberately short-lived (default 2 minutes; override with INVITE_TTL_SECONDS). */
export const inviteTtlMs = () => Math.max(30, Number(process.env.INVITE_TTL_SECONDS) || 120) * 1000;

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
  activated: number;
  status: InviteStatus;
}

interface Actor {
  id: string;
  email: string;
}

export interface IssuedInvite {
  id: string;
  token: string;
  email: string;
  role: RoleKey;
  name: string;
  defaultPassword: string;
  expiresAt: number;
}

function statusOf(row: { accepted_at: number | null; revoked_at: number | null; expires_at: number }): InviteStatus {
  if (row.accepted_at) return "accepted";
  if (row.revoked_at) return "revoked";
  return row.expires_at <= Date.now() ? "expired" : "pending";
}

function chooseDefaultPassword(input: unknown): string {
  if (input === undefined || input === null || input === "") return generatePassword();
  const problem = validatePassword(input);
  if (problem) throw new AuthError(`Default password: ${problem}`, 400);
  return input as string;
}

/** Writes a fresh invite for an existing pending account and returns the one-time link token. */
function issue(userId: string, email: string, role: RoleKey, name: string, defaultPassword: string, actor: Actor): IssuedInvite {
  const now = Date.now();
  const id = randomId();
  const token = randomToken();
  const expiresAt = now + inviteTtlMs();
  db().prepare("UPDATE invites SET revoked_at = ?, temp_password_sealed = NULL WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL").run(now, email);
  db()
    .prepare(
      `INSERT INTO invites (id, email, name, role, token_hash, invited_by, created_at, expires_at, user_id, temp_password_sealed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    )
    .run(id, email, name, role, sha256(token), actor.id, now, expiresAt, userId);
  return { id, token, email, role, name, defaultPassword, expiresAt };
}

/**
 * Creates the staff account with a default password (set by the admin or generated) and a
 * short-lived invite link. The person must replace the default password before using the app.
 */
export function createInvite(input: { email?: unknown; role?: unknown; name?: unknown; password?: unknown }, actor: Actor): IssuedInvite {
  const email = normaliseEmail(input.email);
  if (!email) throw new AuthError("Enter a valid email address.", 400);
  if (!isRole(input.role) || !INVITABLE_ROLES.some((r) => r.key === input.role)) throw new AuthError("Choose a role from the list.", 400);
  const role = input.role;
  const name = typeof input.name === "string" && input.name.trim() ? input.name.trim().slice(0, 120) : email.split("@")[0];
  const existing = db().prepare("SELECT must_change_password FROM users WHERE email = ?").get(email) as unknown as { must_change_password: number } | undefined;
  if (existing) {
    throw new AuthError(existing.must_change_password ? "This person has already been invited. Use “New link” on their invite." : "A team member with this email already exists.", 409);
  }
  const defaultPassword = chooseDefaultPassword(input.password);
  const userId = randomId();
  const database = db();
  database.exec("BEGIN IMMEDIATE");
  try {
    database
      .prepare("INSERT INTO users (id, email, name, password_hash, role, status, created_at, invited_by, must_change_password) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, 1)")
      .run(userId, email, name, hashPassword(defaultPassword), role, Date.now(), actor.id);
    const issued = issue(userId, email, role, name, defaultPassword, actor);
    database.exec("COMMIT");
    audit(actor, "invite.created", email, { role });
    return issued;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

/** A fresh link for someone who hasn't activated yet. The default password stays the same unless a new one is given. */
export function reissueInvite(id: string, actor: Actor, password?: unknown): IssuedInvite {
  const row = db()
    .prepare("SELECT i.email, i.role, i.user_id, u.name, u.must_change_password FROM invites i LEFT JOIN users u ON u.id = i.user_id WHERE i.id = ?")
    .get(id) as unknown as { email: string; role: RoleKey; user_id: string | null; name: string | null; must_change_password: number | null } | undefined;
  if (!row) throw new AuthError("Invite not found.", 404);
  if (!row.user_id || row.must_change_password === null) throw new AuthError("This account no longer exists. Create a new invite.", 409);
  if (!row.must_change_password) throw new AuthError("This person has already set their password.", 409);
  let defaultPassword = "";
  if (password !== undefined && password !== null && password !== "") {
    defaultPassword = chooseDefaultPassword(password);
    db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(defaultPassword), row.user_id);
    db().prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);
  }
  const issued = issue(row.user_id, row.email, row.role, row.name ?? row.email, defaultPassword, actor);
  audit(actor, "invite.resent", row.email, { role: row.role });
  return issued;
}

/** Revokes the link. An account that was never activated is removed. */
export function revokeInvite(id: string, actor: Actor) {
  const row = db()
    .prepare("SELECT i.email, i.accepted_at, i.user_id, u.must_change_password FROM invites i LEFT JOIN users u ON u.id = i.user_id WHERE i.id = ?")
    .get(id) as unknown as { email: string; accepted_at: number | null; user_id: string | null; must_change_password: number | null } | undefined;
  if (!row) throw new AuthError("Invite not found.", 404);
  if (row.accepted_at) throw new AuthError("This invite has already been accepted.", 409);
  db().prepare("UPDATE invites SET revoked_at = COALESCE(revoked_at, ?), temp_password_sealed = NULL WHERE id = ?").run(Date.now(), id);
  if (row.user_id && row.must_change_password === 1) {
    db().prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);
    db().prepare("DELETE FROM users WHERE id = ?").run(row.user_id);
  }
  audit(actor, "invite.revoked", row.email);
}

export function listInvites(): InviteRow[] {
  db().prepare("UPDATE invites SET temp_password_sealed = NULL WHERE temp_password_sealed IS NOT NULL AND expires_at <= ?").run(Date.now());
  const rows = db()
    .prepare(
      `SELECT i.id, i.email, i.name, i.role, i.invited_by, u.name AS invited_by_name, i.created_at, i.expires_at, i.emailed_at, i.accepted_at, i.revoked_at,
              CASE WHEN p.id IS NOT NULL AND p.must_change_password = 0 THEN 1 ELSE 0 END AS activated
       FROM invites i LEFT JOIN users u ON u.id = i.invited_by LEFT JOIN users p ON p.id = i.user_id
       ORDER BY i.created_at DESC`,
    )
    .all() as unknown as Omit<InviteRow, "status">[];
  return rows.map((r) => ({ ...r, status: statusOf(r) }));
}

export function markEmailed(id: string) {
  db().prepare("UPDATE invites SET emailed_at = ? WHERE id = ?").run(Date.now(), id);
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
      `SELECT i.id, i.email, i.name, i.role, i.expires_at, i.accepted_at, i.revoked_at, i.temp_password_sealed, u.name AS invited_by_name
       FROM invites i LEFT JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?`,
    )
    .get(sha256(token)) as unknown as
    | { id: string; email: string; name: string | null; role: RoleKey; expires_at: number; accepted_at: number | null; revoked_at: number | null; temp_password_sealed: string | null; invited_by_name: string | null }
    | undefined;
  if (!row) return { ok: false, reason: "invalid" };
  const status = statusOf(row);
  if (status !== "pending") {
    if (row.temp_password_sealed) db().prepare("UPDATE invites SET temp_password_sealed = NULL WHERE id = ?").run(row.id);
    return { ok: false, reason: status };
  }
  return {
    ok: true,
    invite: {
      email: row.email,
      name: row.name,
      role: row.role,
      invitedBy: row.invited_by_name,
      expiresAt: row.expires_at,
    },
  };
}

/** Marks outstanding invites as used once the account has a password of its own. */
export function completeInvitesFor(userId: string) {
  db().prepare("UPDATE invites SET accepted_at = ?, temp_password_sealed = NULL WHERE user_id = ? AND accepted_at IS NULL AND revoked_at IS NULL").run(Date.now(), userId);
}

interface PendingInvite {
  id: string;
  email: string;
  role: RoleKey;
  user_id: string;
  expires_at: number;
  accepted_at: number | null;
  revoked_at: number | null;
  password_hash: string;
}

const EXPIRED = "This invite link has expired. Sign in with your email and default password to continue.";

/** Step 1 of the invite flow: the link must still be valid and the default password must match. */
function checkDefaultPassword(token: string, password: unknown): PendingInvite {
  const row = db()
    .prepare(
      `SELECT i.id, i.email, i.role, i.user_id, i.expires_at, i.accepted_at, i.revoked_at, u.password_hash
       FROM invites i JOIN users u ON u.id = i.user_id WHERE i.token_hash = ? AND u.must_change_password = 1`,
    )
    .get(sha256(token)) as unknown as PendingInvite | undefined;
  if (!row || statusOf(row) !== "pending") throw new AuthError(EXPIRED, 410);
  const gate = throttle(`invite:${row.id}`, 8, 15 * 60 * 1000);
  if (!gate.allowed) throw new AuthError("Too many attempts. Ask your administrator for a new link.", 429);
  if (typeof password !== "string" || !verifyPassword(password, row.password_hash)) throw new AuthError("That default password isn’t right. Check the one your administrator gave you.", 400);
  return row;
}

export function verifyInvite(token: string, password: unknown) {
  checkDefaultPassword(token, password);
  return { ok: true as const };
}

/** Step 2: re-checks the default password, then sets the person's own password and signs them in. */
export function acceptInvite(token: string, input: { currentPassword: unknown; name?: unknown; newPassword: unknown }, meta: { ip?: string; userAgent?: string } = {}) {
  const now = Date.now();
  const row = checkDefaultPassword(token, input.currentPassword);
  const problem = validatePassword(input.newPassword);
  if (problem) throw new AuthError(problem, 400);
  if (input.newPassword === input.currentPassword) throw new AuthError("Choose a new password — not the default one.", 400);
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 120) : "";
  if (name.length < 2) throw new AuthError("Enter your full name.", 400);

  const database = db();
  database.exec("BEGIN IMMEDIATE");
  try {
    const claimed = database
      .prepare("UPDATE invites SET accepted_at = ?, temp_password_sealed = NULL WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?")
      .run(now, row.id, now);
    if (claimed.changes !== 1) throw new AuthError(EXPIRED, 410);
    database.prepare("UPDATE users SET name = ?, password_hash = ?, must_change_password = 0 WHERE id = ?").run(name, hashPassword(input.newPassword as string), row.user_id);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  audit({ id: row.user_id, email: row.email }, "invite.accepted", row.email, { role: row.role });
  const sessionToken = createSessionFor(row.user_id, meta);
  audit({ id: row.user_id, email: row.email }, "auth.login", row.email);
  return { token: sessionToken, user: { id: row.user_id, email: row.email, name, role: row.role, mustChangePassword: false } };
}
