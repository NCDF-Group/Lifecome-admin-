import { db, audit } from "./db/index.ts";
import { AuthError, revokeSessionsFor } from "./auth/core.ts";
import { isRole, type RoleKey } from "./roles.ts";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  status: "active" | "disabled";
  created_at: number;
  last_login_at: number | null;
}

export function listUsers(): UserRecord[] {
  return db().prepare("SELECT id, email, name, role, status, created_at, last_login_at FROM users ORDER BY created_at ASC").all().map((r) => ({ ...r })) as unknown as UserRecord[];
}

export function updateUser(id: string, patch: { role?: unknown; status?: unknown }, actor: { id: string; email: string }) {
  const user = db().prepare("SELECT id, email, role, status FROM users WHERE id = ?").get(id) as unknown as { id: string; email: string; role: RoleKey; status: string } | undefined;
  if (!user) throw new AuthError("Team member not found.", 404);
  if (user.id === actor.id) throw new AuthError("You can’t change your own role or status.", 400);
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
}
