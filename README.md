# LifeCome Health Professional Portal

Next.js (App Router, TypeScript) application: the Professional Portal and the connected LifeCome Health patient app.

## Run

Node.js 22.18+ (24 recommended).

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test           # config tests and clinical workflow / patient-bridge regression
npm run lint && npm run typecheck
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Professional Portal (`public/portal.js` workflow engine) |
| `/patient-app?patient=0..2` | Companion view of released records |
| `/patient/` | LifeCome Health patient app (static, `public/patient/`) |
| `/healthz`, `/runtime-config.js` | Health check; public browser configuration |

## Structure

- `src/app/` routes, layout (Manrope + DM Sans via `next/font`), route handlers.
- `src/components/` `PortalRuntime`, `PatientRecordView`.
- `src/lib/config.ts` validated public runtime configuration.
- `src/styles/` portal and patient-record styles.
- `public/brand/` LifeCome Live logo files; `public/images/` photography.
- `public/portal.js` portal workflow and release rules; `public/patient/` patient app and record bridge.
- `scripts/verify-workflows.mjs`, `test/` regression tests.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_ORIGIN` | current origin | Professional origin accepted by the patient bridge |
| `PATIENT_APP_URL` | current origin + `/patient/` | Patient app base URL, including path |

Both are public (served from `/runtime-config.js`); never put secrets in them. Host at the domain root. `docker build -t lifecome-portal . && docker run -p 3000:3000 lifecome-portal` builds a standalone image.
