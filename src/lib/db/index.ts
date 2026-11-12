import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { hashPassword, randomId, randomToken } from "../security.ts";

const globalForDb = globalThis as unknown as { __lifecomeDb?: DatabaseSync };

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  last_login_at INTEGER,
  invited_by TEXT
);
CREATE TABLE IF NOT EXISTS invites (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  name TEXT,
  role TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  emailed_at INTEGER,
  accepted_at INTEGER,
  accepted_user_id TEXT,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS invites_email ON invites(email);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  ip TEXT,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  actor_id TEXT,
  actor_email TEXT,
  action TEXT NOT NULL,
  target TEXT,
  meta TEXT
);
CREATE INDEX IF NOT EXISTS audit_at ON audit_log(at);
CREATE INDEX IF NOT EXISTS audit_action ON audit_log(action);
`;

export function openDatabase(file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "lifecome.db")): DatabaseSync {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const database = new DatabaseSync(file);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  database.exec(SCHEMA);
  migrate(database);
  seedSuperadmin(database);
  return database;
}

/** Additive column migrations for databases created by earlier versions. */
function migrate(database: DatabaseSync) {
  const has = (table: string, column: string) =>
    (database.prepare(`PRAGMA table_info(${table})`).all() as unknown as { name: string }[]).some((c) => c.name === column);
  if (!has("users", "must_change_password")) database.exec("ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0");
  if (!has("invites", "user_id")) database.exec("ALTER TABLE invites ADD COLUMN user_id TEXT");
  if (!has("invites", "temp_password_sealed")) database.exec("ALTER TABLE invites ADD COLUMN temp_password_sealed TEXT");
  // Public practitioner profile shown in the patient app.
  if (!has("users", "title")) database.exec("ALTER TABLE users ADD COLUMN title TEXT");
  if (!has("users", "bio")) database.exec("ALTER TABLE users ADD COLUMN bio TEXT");
  if (!has("users", "languages")) database.exec("ALTER TABLE users ADD COLUMN languages TEXT");
  if (!has("users", "show_in_app")) database.exec("ALTER TABLE users ADD COLUMN show_in_app INTEGER NOT NULL DEFAULT 1");
}

// Module-level, so it resets when dev hot-reloads this file: an open connection then picks up new columns.
let migratedThisModule = false;

export function db(): DatabaseSync {
  globalForDb.__lifecomeDb ??= openDatabase();
  if (!migratedThisModule) {
    migrate(globalForDb.__lifecomeDb);
    migratedThisModule = true;
  }
  return globalForDb.__lifecomeDb;
}

/** Seeds the first super administrator. Runs only while no super administrator exists. */
function seedSuperadmin(database: DatabaseSync) {
  const existing = database.prepare("SELECT 1 FROM users WHERE role = 'superadmin' LIMIT 1").get();
  if (existing) return;
  const email = (process.env.SEED_SUPERADMIN_EMAIL || "superadmin@lifecome.health").trim().toLowerCase();
  const name = process.env.SEED_SUPERADMIN_NAME || "Super Admin";
  let password = process.env.SEED_SUPERADMIN_PASSWORD;
  const generated = !password;
  if (!password) password = randomToken(15);
  const now = Date.now();
  database
    .prepare("INSERT INTO users (id, email, name, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, 'superadmin', 'active', ?)")
    .run(randomId(), email, name, hashPassword(password), now);
  database.prepare("INSERT INTO audit_log (at, actor_email, action, target) VALUES (?, 'system', 'system.seed', ?)").run(now, email);
  console.log(
    generated
      ? `\n[lifecome] Seeded super administrator.\n  email:    ${email}\n  password: ${password}\n  (generated once; set SEED_SUPERADMIN_PASSWORD to choose your own before first run)\n`
      : `\n[lifecome] Seeded super administrator ${email}.\n`,
  );
}

export function audit(actor: { id?: string; email?: string } | null, action: string, target?: string, meta?: Record<string, unknown>) {
  db()
    .prepare("INSERT INTO audit_log (at, actor_id, actor_email, action, target, meta) VALUES (?, ?, ?, ?, ?, ?)")
    .run(Date.now(), actor?.id ?? null, actor?.email ?? null, action, target ?? null, meta ? JSON.stringify(meta) : null);
}
