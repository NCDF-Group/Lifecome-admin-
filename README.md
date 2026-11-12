# LifeCome Health

Next.js (App Router, TypeScript) platform: a sign-in page, an invite-only team system, a super administrator console and the professional portal, plus the patient app.

## Run

Node.js 24 (22.18+ works).

```sh
cp .env.example .env.local   # set SEED_SUPERADMIN_* (see below)
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start
npm test && npm run lint && npm run typecheck
```

## How access works

1. The first page (`/`) is **sign in**. There is no public sign-up.
2. A **super administrator** is seeded into the database on first start from `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` (if the password is blank, a random one is printed once in the server log).
3. In **/admin/invites** the super administrator adds a team member: email, name, **role** and a **default password** (typed or generated with one click). The account is created immediately.
4. An **invite link** is issued that **expires after 2 minutes** (`INVITE_TTL_SECONDS` to change). The admin sends the link and the default password to the person.
5. Signing in is a **two-step flow** for invitees: **1 · Verify** — enter the default password; **2 · New password** — choose their own (and confirm their name). Then they land in their role's workspace.
6. If the link has expired, they sign in at `/` with their email and default password and the same step 2 appears before anything else is reachable.
6a. “New link” issues a fresh 2-minute link (same default password); “Revoke” removes an account that was never activated.
7. The console also has a dashboard per role, team management (change role, disable), analytics and an audit log.

The default password is only ever stored as a hash and is never shown on the invite page. If `RESEND_API_KEY` and `MAIL_FROM` are set, the link is emailed; share the default password separately.

## Routes

| Path | Who |
| --- | --- |
| `/` | Sign in |
| `/invite/[token]` | Accept an invite (2-minute link) |
| `/set-password` | Forced password change after signing in with a default password |
| `/admin` · `/admin/roles[/role]` · `/admin/team` · `/admin/invites` · `/admin/analytics` · `/admin/audit` | Super administrator |
| `/portal` | Professional portal (role from the account; super administrators preview a role with `?as=`) |
| `/patient/`, `/patient-app` | Patient app and released-records view |
| `/api/auth/*`, `/api/invites*`, `/api/users*`, `/api/analytics` | JSON API |
| `/healthz`, `/runtime-config.js` | Health and public config |

## Backend

SQLite via Node's built-in `node:sqlite` (`data/lifecome.db`, created on first run; set `DATABASE_PATH` to move it). Tables: `users`, `invites`, `sessions`, `audit_log`. Data access lives in `src/lib/` (`db`, `auth`, `invites`, `users`, `analytics`, `mailer`) so the store can be swapped for Postgres without touching the UI.

Security: scrypt password hashing, httpOnly SameSite session cookies (hashed in the DB), invite tokens stored hashed, sign-in throttling, same-origin checks on mutations, role checks on every admin API and page, disabled accounts lose their sessions immediately.

## Structure

- `src/app/` pages and route handlers; `src/components/` UI; `src/lib/` backend logic; `src/styles/` CSS.
- `public/portal.js` professional portal engine; `public/patient/` patient app.
- `test/` backend tests; `scripts/verify-workflows.mjs` clinical workflow regression (uses `scripts/fixtures/` test data only).

## Not yet connected

The professional portal's clinical screens (patients, appointments, notes, prescriptions, results) have no data source yet, so they show empty states. They need a patients/clinical API, which is the next phase.
