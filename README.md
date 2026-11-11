# LifeCome Health Professional Portal (Next.js)

Next.js (App Router, TypeScript) port of the supplied Node.js package: the interactive Professional Portal, the 56-screen catalogue, the integration handover and the bundled patient-app demo.

**Demonstration software: fictional records only.** There is no clinical database, real authentication, e-prescribing or production patient API. Role switches are demo controls, not authentication.

## Run

Node.js 22.18+ (24 recommended).

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test           # config + content tests, clinical workflow and patient-bridge regression
npm run lint && npm run typecheck
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Interactive Professional Portal (`public/portal.js` workflow engine) |
| `/screen-board` | Filterable catalogue of all 56 screens |
| `/screens/[slug]` | Static layout for one screen (56 pages, prerendered) |
| `/integration` | Professional / patient integration handover |
| `/patient-app?patient=0..2` | Companion view of released records |
| `/patient/` | Full bundled patient-app demo (static, `public/patient/`) |
| `/healthz`, `/runtime-config.js` | Health check; allowlisted public browser config |

Legacy `.html` URLs from the original package redirect to the clean routes.

## Structure

- `src/app/` routes, layout (Manrope + DM Sans via `next/font`), route handlers.
- `src/components/` `PortalRuntime`, `ScreenBoard` (client-side filtering), `PatientRecordView`, `Markup`.
- `src/content/` screen markup (`screens/*.html`, `screen-board.json`, `integration.html`) — edit these to change a static screen layout.
- `src/lib/config.ts` validated public runtime configuration.
- `src/styles/` portal, board, handover and patient-record styles.
- `public/portal.js` preserved workflow and release rules; `public/patient/` patient app and bridge.
- `scripts/verify-workflows.mjs`, `test/` regression tests. `docs/` conversion notes and the original integration contract.

Static screen previews (`src/content`) and the interactive route renderer (`public/portal.js`) are separate representations inherited from the original package; keep them consistent.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_ORIGIN` | current origin | Professional origin accepted by the patient bridge |
| `PATIENT_APP_URL` | current origin + `/patient/` | Patient app base URL, including path |

Both are public (served from `/runtime-config.js`); never put secrets in them. Host at the domain root. A multi-stage `Dockerfile` builds a standalone image (`docker build -t lifecome-portal . && docker run -p 3000:3000 lifecome-portal`).
