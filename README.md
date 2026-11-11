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
2. A **super administrator** is seeded into the database on first start from `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` (if the password is blank, a random one is generated and printed once in the server log).
3. The super administrator opens **/admin** to create an **invite** for any role (doctor, nurse, care professional, wellbeing practitioner, clinical manager, reception/operations). Invites are single-use, expire after 7 days, and can be revoked or re-issued.
4. The invitee opens `/invite/<token>`, sets their name and password, and lands in the professional portal for their role.
5. The console has a dashboard per role, team management (change role, disable), analytics and an audit log.

If `RESEND_API_KEY` and `MAIL_FROM` are set, invites are emailed; otherwise the link is shown to copy and share.

## Routes

| Path | Who |
| --- | --- |
| `/` | Sign in |
| `/invite/[token]` | Accept an invite |
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
