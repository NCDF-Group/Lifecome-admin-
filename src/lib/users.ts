import { db, audit } from "./db/index.ts";
import { AuthError, revokeSessionsFor } from "./auth/core.ts";
import { PATIENT_FACING_ROLES, isRole, roleInfo, type RoleKey } from "./roles.ts";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  status: "active" | "disabled";
  created_at: number;
  last_login_at: number | null;
  must_change_password: number;
  title: string | null;
  bio: string | null;
  languages: string | null;
  show_in_app: number;
}

const COLUMNS = "id, email, name, role, status, created_at, last_login_at, must_change_password, title, bio, languages, show_in_app";

export function listUsers(): UserRecord[] {
  return db().prepare(`SELECT ${COLUMNS} FROM users ORDER BY created_at ASC`).all().map((r) => ({ ...r })) as unknown as UserRecord[];
}

/** Why someone is or isn't listed in the patient app. */
export function appVisibility(u: Pick<UserRecord, "role" | "status" | "must_change_password" | "show_in_app">): { visible: boolean; reason: string } {
  if (!PATIENT_FACING_ROLES.includes(u.role)) return { visible: false, reason: "Staff-only role" };
  if (u.status !== "active") return { visible: false, reason: "Account disabled" };
  if (u.must_change_password) return { visible: false, reason: "Not activated yet" };
  if (!u.show_in_app) return { visible: false, reason: "Hidden by admin" };
  return { visible: true, reason: "Shown in patient app" };
}

const text = (v: unknown, max: number, field: string): string | null => {
  if (v === undefined || v === null) return null;
  if (typeof v !== "string") throw new AuthError(`${field} must be text.`, 400);
  const t = v.trim();
  if (t.length > max) throw new AuthError(`${field} must be ${max} characters or fewer.`, 400);
  return t || null;
};

export interface ProfilePatch {
  name?: unknown;
  title?: unknown;
  bio?: unknown;
  languages?: unknown;
  showInApp?: unknown;
}

export function updateUser(id: string, patch: { role?: unknown; status?: unknown } & ProfilePatch, actor: { id: string; email: string }) {
  const user = db().prepare("SELECT id, email, role, status FROM users WHERE id = ?").get(id) as unknown as { id: string; email: string; role: RoleKey; status: string } | undefined;
  if (!user) throw new AuthError("Team member not found.", 404);
  const touchesAccess = patch.role !== undefined || patch.status !== undefined;
  if (touchesAccess && user.id === actor.id) throw new AuthError("You can’t change your own role or status.", 400);
  if (patch.role !== undefined) {
    if (!isRole(patch.role) || patch.role === "superadmin") throw new AuthError("Choose a valid role.", 400);
    if (user.role === "superadmin") throw new AuthError("Super administrators can’t be reassigned here.", 400);
    db().prepare("UPDATE users SET role = ? WHERE id = ?").run(patch.role, id);
    audit(actor, "user.role_changed", user.email, { from: user.role, to: patch.role });
  }
  if (patch.status !== undefined) {
    if (patch.status !== "active" && patch.status !== "disabled") throw new AuthError("Invalid status.", 400);
    if (user.role === "superadmin") throw new AuthError("Super administrators can’t be disabled here.", 400);
    db().prepare("UPDATE users SET status = ? WHERE id = ?").run(patch.status, id);
    if (patch.status === "disabled") revokeSessionsFor(id);
    audit(actor, patch.status === "disabled" ? "user.disabled" : "user.enabled", user.email);
  }
  const profileKeys = ["name", "title", "bio", "languages", "showInApp"] as const;
  if (profileKeys.some((k) => patch[k] !== undefined)) {
    const name = patch.name === undefined ? undefined : text(patch.name, 120, "Name");
    if (patch.name !== undefined && (!name || name.length < 2)) throw new AuthError("Enter a full name.", 400);
    if (patch.showInApp !== undefined && typeof patch.showInApp !== "boolean") throw new AuthError("Invalid visibility.", 400);
    const sets: string[] = [];
    const values: (string | number | null)[] = [];
    const set = (column: string, value: string | number | null) => {
      sets.push(`${column} = ?`);
      values.push(value);
    };
    if (name !== undefined) set("name", name);
    if (patch.title !== undefined) set("title", text(patch.title, 80, "Title"));
    if (patch.bio !== undefined) set("bio", text(patch.bio, 600, "Bio"));
    if (patch.languages !== undefined) set("languages", text(patch.languages, 120, "Languages"));
    if (patch.showInApp !== undefined) set("show_in_app", patch.showInApp ? 1 : 0);
    db().prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).run(...values, id);
    audit(actor, "user.profile_updated", user.email);
  }
}

export interface Practitioner {
  id: string;
  name: string;
  role: RoleKey;
  roleLabel: string;
  initials: string;
  title: string;
  bio: string | null;
  languages: string | null;
}

export const initialsOf = (name: string) =>
  name
    .replace(/^(dr|mr|mrs|ms|mx|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Public, patient-safe view of the team: no emails, no internal status, only people ready to see patients. */
export function listPractitioners(): Practitioner[] {
  return listUsers()
    .filter((u) => appVisibility(u).visible)
    .map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      roleLabel: roleInfo(u.role).label,
      initials: initialsOf(u.name),
      title: u.title || roleInfo(u.role).label,
      bio: u.bio,
      languages: u.languages,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
