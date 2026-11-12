import { db, audit } from "../db/index.ts";
import { randomId, randomToken, sha256, verifyPassword, clearThrottle, throttle, normaliseEmail, hashPassword, validatePassword } from "../security.ts";
import type { RoleKey } from "../roles.ts";

export const SESSION_COOKIE = "lc_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  /** Signed in with a default password: must choose a new one before doing anything else. */
  mustChangePassword: boolean;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  status: string;
  password_hash: string;
  must_change_password: number;
}

const DUMMY_HASH = "scrypt$16384$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);

const toSessionUser = (r: { id: string; email: string; name: string; role: RoleKey; must_change_password: number }): SessionUser => ({
  id: r.id,
  email: r.email,
  name: r.name,
  role: r.role,
  mustChangePassword: r.must_change_password === 1,
});

export function login(emailInput: unknown, password: unknown, meta: { ip?: string; userAgent?: string } = {}) {
  const email = normaliseEmail(emailInput);
  if (!email || typeof password !== "string" || !password) throw new AuthError("Enter your email and password.", 400);
  const key = `login:${email}`;
  const gate = throttle(key, 8, 15 * 60 * 1000);
  if (!gate.allowed) throw new AuthError(`Too many attempts. Try again in ${Math.ceil(gate.retryAfterSec / 60)} minutes.`, 429);

  const row = db()
    .prepare("SELECT id, email, name, role, status, password_hash, must_change_password FROM users WHERE email = ?")
    .get(email) as unknown as UserRow | undefined;
  // Always run a hash comparison so response time does not reveal whether the account exists.
  const ok = verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) {
    audit(null, "auth.login_failed", email);
    throw new AuthError("Incorrect email or password.");
  }
  if (row.status !== "active") {
    audit({ id: row.id, email: row.email }, "auth.login_blocked", email);
    throw new AuthError("This account has been disabled. Contact your administrator.", 403);
  }
  clearThrottle(key);
  const token = createSessionFor(row.id, meta);
  audit({ id: row.id, email: row.email }, "auth.login", row.email);
  return { token, user: toSessionUser(row) };
}

export function createSessionFor(userId: string, meta: { ip?: string; userAgent?: string } = {}) {
  const token = randomToken();
  const now = Date.now();
  db()
    .prepare("INSERT INTO sessions (id, user_id, created_at, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)")
    .run(sha256(token), userId, now, now + SESSION_TTL_MS, meta.ip ?? null, meta.userAgent?.slice(0, 200) ?? null);
  db().prepare("UPDATE users SET last_login_at = ? WHERE id = ?").run(now, userId);
  return token;
}

export function userForToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.must_change_password FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ? AND u.status = 'active'`,
    )
    .get(sha256(token), Date.now()) as unknown as UserRow | undefined;
  return row ? toSessionUser(row) : null;
}

/** Replaces the password after checking the current one. Clears the must-change flag. */
export function changePassword(userId: string, current: unknown, next: unknown, keepSessionToken?: string) {
  const row = db().prepare("SELECT id, email, password_hash FROM users WHERE id = ?").get(userId) as unknown as UserRow | undefined;
  if (!row) throw new AuthError("Account not found.", 404);
  if (typeof current !== "string" || !verifyPassword(current, row.password_hash)) throw new AuthError("Your current password is incorrect.", 400);
  const problem = validatePassword(next);
  if (problem) throw new AuthError(problem, 400);
  if (next === current) throw new AuthError("Choose a password that is different from your current one.", 400);
  db().prepare("UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?").run(hashPassword(next as string), userId);
  // Sign out other devices.
  if (keepSessionToken) db().prepare("DELETE FROM sessions WHERE user_id = ? AND id <> ?").run(userId, sha256(keepSessionToken));
  audit({ id: row.id, email: row.email }, "auth.password_changed", row.email);
}

export function logout(token: string | undefined | null) {
  if (!token) return;
  const user = userForToken(token);
  db().prepare("DELETE FROM sessions WHERE id = ?").run(sha256(token));
  if (user) audit(user, "auth.logout", user.email);
}

export function revokeSessionsFor(userId: string) {
  db().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

export { randomId };
