import { db } from "./db/index.ts";
import { ROLES, type RoleKey } from "./roles.ts";

const DAY = 86_400_000;

export interface DayPoint {
  day: string;
  value: number;
}

function startOfDay(ms: number) {
  const d = new Date(ms);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

function series(sql: string, params: (string | number)[], days: number): DayPoint[] {
  const since = startOfDay(Date.now()) - (days - 1) * DAY;
  const rows = db().prepare(sql).all(since, ...params) as unknown as { day: string; n: number }[];
  const map = new Map(rows.map((r) => [r.day, r.n]));
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(since + i * DAY).toISOString().slice(0, 10);
    return { day, value: map.get(day) ?? 0 };
  });
}

const dailyCount = (table: string, col: string, where = "") =>
  `SELECT strftime('%Y-%m-%d', ${col} / 1000, 'unixepoch') AS day, COUNT(*) AS n FROM ${table} WHERE ${col} >= ? ${where} GROUP BY day`;

export interface RoleSummary {
  role: RoleKey;
  members: number;
  active: number;
  pendingInvites: number;
  lastLoginAt: number | null;
}

export function roleSummaries(): RoleSummary[] {
  const database = db();
  const users = database.prepare("SELECT role, COUNT(*) AS members, SUM(status = 'active') AS active, MAX(last_login_at) AS last FROM users GROUP BY role").all() as unknown as { role: RoleKey; members: number; active: number; last: number | null }[];
  const pending = database.prepare("SELECT role, COUNT(*) AS n FROM invites WHERE accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ? GROUP BY role").all(Date.now()) as unknown as { role: RoleKey; n: number }[];
  return ROLES.map((r) => {
    const u = users.find((x) => x.role === r.key);
    return { role: r.key, members: u?.members ?? 0, active: u?.active ?? 0, pendingInvites: pending.find((p) => p.role === r.key)?.n ?? 0, lastLoginAt: u?.last ?? null };
  });
}

export function overview(days = 30) {
  const database = db();
  const now = Date.now();
  const one = <T>(sql: string, ...p: (string | number)[]) => ({ ...(database.prepare(sql).get(...p) as object) }) as unknown as T;
  const totals = one<{ total: number; active: number; disabled: number }>("SELECT COUNT(*) AS total, COALESCE(SUM(status='active'),0) AS active, COALESCE(SUM(status='disabled'),0) AS disabled FROM users");
  const inv = one<{ sent: number; pending: number; accepted: number; expired: number; revoked: number }>(
    `SELECT COUNT(*) AS sent,
      COALESCE(SUM(accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?),0) AS pending,
      COALESCE(SUM(accepted_at IS NOT NULL),0) AS accepted,
      COALESCE(SUM(accepted_at IS NULL AND revoked_at IS NULL AND expires_at <= ?),0) AS expired,
      COALESCE(SUM(accepted_at IS NULL AND revoked_at IS NOT NULL),0) AS revoked FROM invites`,
    now,
    now,
  );
  const active7 = one<{ n: number }>("SELECT COUNT(DISTINCT actor_id) AS n FROM audit_log WHERE action = 'auth.login' AND at >= ?", now - 7 * DAY).n;
  const logins7 = one<{ n: number }>("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'auth.login' AND at >= ?", now - 7 * DAY).n;
  const failed7 = one<{ n: number }>("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'auth.login_failed' AND at >= ?", now - 7 * DAY).n;
  const ttaRow = one<{ avg: number | null }>("SELECT AVG(accepted_at - created_at) AS avg FROM invites WHERE accepted_at IS NOT NULL");
  return {
    totals,
    invites: { ...inv, acceptanceRate: inv.sent ? inv.accepted / inv.sent : 0, avgHoursToAccept: ttaRow.avg ? ttaRow.avg / 3_600_000 : null },
    activeUsers7d: active7,
    logins7d: logins7,
    failedLogins7d: failed7,
    roles: roleSummaries(),
    logins: series(dailyCount("audit_log", "at", "AND action = 'auth.login'"), [], days),
    invitesSent: series(dailyCount("invites", "created_at"), [], days),
    joined: series(dailyCount("users", "created_at"), [], days),
  };
}

export interface AuditEntry {
  id: number;
  at: number;
  actor_email: string | null;
  action: string;
  target: string | null;
  meta: string | null;
}

export function recentAudit(limit = 50, role?: RoleKey): AuditEntry[] {
  if (role) {
    return db()
      .prepare(
        `SELECT a.id, a.at, a.actor_email, a.action, a.target, a.meta FROM audit_log a
         JOIN users u ON u.id = a.actor_id WHERE u.role = ? ORDER BY a.id DESC LIMIT ?`,
      )
      .all(role, limit).map((r) => ({ ...r })) as unknown as AuditEntry[];
  }
  return db().prepare("SELECT id, at, actor_email, action, target, meta FROM audit_log ORDER BY id DESC LIMIT ?").all(limit).map((r) => ({ ...r })) as unknown as AuditEntry[];
}
