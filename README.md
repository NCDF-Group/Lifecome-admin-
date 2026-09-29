# LifeCome Live - Operations console

The internal admin app for [LifeCome Live](../README.md) staff: the blueprint's "operations
console" (§1.1) - admin, payer ops, support, audit and content tooling over
[`Lifecome-backend`](../Lifecome-backend)'s API. It is not patient-facing (that's
[`Lifecome-web`](../Lifecome-web) and [`Lifecome-mobile`](../Lifecome-mobile)) and it is not the
clinician-facing **provider workspace** the blueprint describes separately (§1.1) - that's a
different app, for doctors and care coordinators, not built here.

## Status

**Wired to the real backend.** `/login` signs a staff member in against `Lifecome-backend`'s
`POST /admin/auth/login`, every `(console)/*` route is guarded (redirects to `/login` without a
valid session), and **Dashboard, Patients, Providers, Bookings, Payments, Payers, Eligibility,
Audit log, Consent, Notifications, Service catalogue, Staff & roles and Locations** all fetch from
the live `/admin/*` API - no demo data remains anywhere in the app. **Scheduling, Consultations,
Clinical records, Documents, Care coordination, Authorisations, Messaging and Settings** still
render a labelled placeholder: `Lifecome-backend` has no admin endpoints for those modules yet, so
there's nothing real to wire them to.

See [Talking to the backend](#talking-to-the-backend) for how auth and data fetching work, and
[Where the real data differs from the old demo data](#where-the-real-data-differs-from-the-old-demo-data)
for every UI field that changed because the real schema is leaner than the placeholder data was.

## Who this is for

The blueprint's operations personas (§2.3) - this console is where they work:

| Role | What they do here |
|---|---|
| Platform administrator | Configuration, content, roles, integrations, monitoring |
| Clinical administrator | Clinician management, governance, escalation |
| HMO operations | Eligibility/authorisation review, reconciliation |
| Support agent | Account and booking support, with restricted clinical-data access |
| (Audit) | Everyone above is themselves audited - see the Audit log section |

Doctors and care coordinators are **not** users of this app - they get the separate provider
workspace the blueprint describes, not yet built.

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript | Same stack as `Lifecome-web` - one set of conventions across the two web apps |
| Styling | Tailwind CSS v4 | Same design tokens as `Lifecome-web` (see [Design tokens](#design-tokens)) |
| Components | [Radix UI](https://radix-ui.com) primitives + hand-rolled styling (the shadcn/ui pattern) | Accessible unstyled primitives (dialog, select, popover, toast...) without a component library's opinionated CSS to fight |
| Data tables | [TanStack Table](https://tanstack.com/table) | Headless - sorting, filtering and pagination logic without dictating markup, so every list page shares one `DataTable` |
| Data fetching | Plain `async` server components calling `lib/api/admin.ts` | Every list/detail page is a server component that awaits its data directly - see [Talking to the backend](#talking-to-the-backend) for why this isn't TanStack Query |
| Charts | [Recharts](https://recharts.org) | Composable SVG charts for the dashboard's volume/status views |
| API client | Hand-rolled `fetch` wrapper (`lib/api/client.ts`) | `openapi-typescript` codegen (`npm run generate:api`) is still available but not run yet - see [Getting started](#getting-started) |

`@tanstack/react-query` and `react-hook-form` remain dependencies for future client-side mutation
forms (e.g. "Compose broadcast", "Invite staff member" - see the disabled buttons on those pages)
but aren't used for the read paths built so far.

## Getting started

You need Node.js 20+ and a running `Lifecome-backend` (see its README) - every page in this app now
calls it directly, there's no offline/demo-data fallback anymore.

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev                  # http://localhost:3000 by default
```

Then, on `Lifecome-backend`, create the first staff account (`npm run db:seed:staff` - see its
README) and sign in with those credentials at `/login`.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the built app |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generate:api` | Regenerate `src/lib/api/generated/schema.d.ts` from the backend's live OpenAPI contract (`$NEXT_PUBLIC_API_URL/docs-json`) - not run yet; every feature's `types.ts` is hand-written against the backend's actual response shapes in the meantime |

## Deploying

[Vercel](https://vercel.com) - built by the Next.js team, zero-config for the App Router, and
free for a project this size. There's no `vercel.json` in this repo because none is needed.

1. Deploy `Lifecome-backend` first (see its README's "Deploying") - you need its live URL before
   this app can point at anything real.
2. Push this repo to GitHub/GitLab, then in Vercel: **Add New → Project**, import it. If this repo
   lives in the same monorepo as the other LifeCome Live apps, set **Root Directory** to
   `Lifecome-admin` so Vercel doesn't try to build the whole workspace.
3. Set one environment variable: `NEXT_PUBLIC_API_URL` = your deployed backend's URL (the
   `.onrender.com` one, or wherever it ended up) - no trailing slash, no `/api/v1` suffix
   (`lib/api/client.ts` appends that itself).
4. Deploy. Then go back to the backend's `CORS_ORIGIN` env var and add this app's `.vercel.app`
   URL (or custom domain) if `Lifecome-web` also needs to reach the same backend from a browser -
   see the note in the backend README about why this app itself doesn't strictly need it (its
   fetches run server-side, not from the browser).
5. Sign in at `/login` with the staff account you seeded on the backend
   (`npm run db:seed:staff`).

Every environment variable this app reads is in `src/config/env.ts` - `NEXT_PUBLIC_API_URL` is the
only one that exists today.

## Talking to the backend

- **Auth is a JWT, held server-side.** `POST /api/auth/login` (a Next.js route handler,
  `app/api/auth/login/route.ts`) proxies to the backend's `POST /admin/auth/login`, then stores the
  returned bearer token in an **httpOnly cookie** (`lib/auth/session.ts`) - the browser never sees
  the raw token. `POST /api/auth/logout` clears it.
- **`(console)/layout.tsx` is the guard.** It calls `requireStaffSession()` (`lib/auth/guards.ts`),
  which redirects to `/login` if the cookie is missing or unreadable, before rendering any console
  page. Nothing below it needs to re-check.
- **Every list/detail page is an `async` server component** that calls its feature's `api.ts`
  (e.g. `features/patients/api.ts`), which calls `adminFetch()` (`lib/api/admin.ts`) - that's what
  reads the session cookie and attaches `Authorization: Bearer <token>` to the real request, and
  redirects to `/login` if the backend ever returns 401 (expired/revoked token). This is a
  deliberate simplification over the originally-planned TanStack Query hooks: since every page
  already fetches its own data server-side (the same pattern the demo-data version used), adding a
  client-side query layer for the initial page load would be complexity without benefit. TanStack
  Query remains available for future client-side mutations (forms, optimistic updates).
- **List pages fetch up to 100 rows** (`listX({ pageSize: 100 })`) and let the existing
  `DataTable` do client-side sort/search/pagination, matching how it already worked against demo
  data. `DataTable` has no server-side pagination props today - real pagination controls wired to
  the backend's `page`/`pageSize` params is future work if a list ever needs more than 100 rows
  shown at once.
- **`Payers` and `Service catalogue`** call the backend's existing public `GET /payers` /
  `GET /clinical-services` directly (no `/admin` prefix, no pagination envelope - they return a
  plain array) rather than new guarded endpoints, because those endpoints already existed and
  needed no changes.

## Where the real data differs from the old demo data

Wiring to `Lifecome-backend` surfaced a few places where the real schema has fewer (or
differently-shaped) fields than the placeholder demo data assumed. Rather than inventing numbers
to fill the gap, the UI was adjusted to show only what's real:

- **Providers**: no `rating`, `reviewCount`, `qualifications`, `yearsOfExperience` or `clinicName`
  columns exist on `Lifecome-backend`'s `providers` table. The list/detail pages now show
  specialty, consultation modes, languages, hub city/state and network status instead.
- **Payers**: no `supportPhone`, `activeMembers` or `integrationStatus` columns exist. The
  list/detail pages now show integration mode, live/not-live status and display order instead.
- **Bookings/Payments/Eligibility**: the backend's list endpoints join in patient/provider/service
  names (see each admin service's `adminList` in `Lifecome-backend`) so these pages show names, not
  raw UUIDs - but a booking's "date" column is now when it was *booked* (`createdAt`), not a
  scheduled slot time, since that lives on a separate `availabilitySlots` row this pass didn't join.
- **Consent**: the real model is a patient consenting to a versioned platform document (terms,
  privacy notice, treatment, record sharing) - there's no "grant access to a named person with a
  role" concept the old demo data showed. The page reflects the real model.
- **Notifications**: `Lifecome-backend` previously had no persistence for sent notifications at all
  (fire-and-forget BullMQ jobs only) - a `notification_logs` table was added alongside this wiring
  so the page has something real to read. There's no delivery-rate percentage; status is
  queued/sent/failed per notification instead.
- **Staff**: only `active`/`suspended` exist as statuses (no `invited` - there's no invite flow on
  the backend yet, hence the disabled "Invite staff member" button).
- **Dashboard**: `/admin/dashboard` is a point-in-time aggregate (patients, active providers,
  bookings, successful-payment totals, a 14-day bookings trend, bookings/payments by status) - it
  has no "+8% vs yesterday" comparison, so `StatCard` no longer shows a trend arrow/delta (that
  would be fabricated without a real prior-period baseline). The old "Payer mix" panel is now
  "Bookings by status" (real data); the old curated "Recent audit alerts" panel is now the
  unfiltered 5 most recent rows from `/admin/audit-events`.

## Layout

```
src/
  app/
    (auth)/login/            Real staff sign-in - posts to /api/auth/login
    api/auth/                 Route handlers proxying to the backend and managing the session cookie
    (console)/                Every guarded section, one folder per module
      layout.tsx               requireStaffSession() guard, then the sidebar + topbar shell
      dashboard/                Real: a photo banner, live stats, a bookings-trend chart, status
                                 breakdown, recent audit events
      patients/, providers/     Real: searchable/sortable list + detail page (with an Avatar)
      bookings/, payments/      Real: list (reuses the same DataTable) - detail pages still placeholder
      payers/, audit/, consent/, notifications/, service-catalogue/, staff/, eligibility/
                                 Real: list, most with a detail page
      locations/                 Real: patient/provider counts by registered city - see
                                 "Locations, not tracking" below
      scheduling/, consultations/, clinical-records/, documents/,
      care-coordination/, authorisations/, messaging/, settings/
                                 Placeholder - see PagePlaceholder below
    layout.tsx, globals.css   Root shell and design tokens
  components/
    layout/                   AppSidebar, AppTopbar (shows the real signed-in staff member), MobileNav, SidebarProvider
    data-table/               The shared DataTable + its toolbar and pagination
    charts/                   Recharts wrappers (client components)
    shared/                   PageHeader, Avatar, StatCard, StatusPill, WelcomeBanner, PagePlaceholder
    ui/                       Where generated shadcn/ui-style primitives go (empty so far)
  features/
    <domain>/                 One folder per backend module (patients, bookings, payments, ...)
      types.ts                 Hand-written types matching the backend's actual response shape
      api.ts                    async functions calling lib/api/admin.ts - see Talking to the backend
      components/                Feature-specific UI (e.g. patients-columns.tsx, patients-table.tsx)
    staff/roles.ts             Static role/permission copy - no backend equivalent, see its own comment
  lib/
    api/client.ts             Typed fetch wrapper attaching a bearer token - see Stack table
    api/admin.ts               Session-aware wrapper every feature's api.ts calls
    api/pagination.ts          Shared PaginatedResult<T> type + query-string builder
    api/generated/            openapi-typescript output (gitignored - see npm run generate:api)
    auth/session.ts            Reads the httpOnly session cookie, decodes the JWT for display
    auth/roles.ts               StaffRole type + label map (split out so client components can use it)
    auth/guards.ts              requireStaffSession() - the console layout's redirect-to-/login guard
    format.ts                  formatRelativeTime() for the dashboard's audit-event list
  config/
    env.ts                    Zod-validated environment variables
    navigation.ts              The sidebar's contents - one entry per backend module
```

The sidebar collapses at every screen size from one hamburger in `AppTopbar`: below `lg` it opens
`MobileNav` as an overlay drawer; at `lg` and up, the same button collapses/expands the persistent
`AppSidebar` in place, via the shared `open` state in `components/layout/sidebar-context.tsx`.

## Locations, not tracking

`/locations` shows how many patients and providers are registered in each city - built from each
person's self-reported `city`/`state` on `Lifecome-backend` (`patients` and `providers` tables -
the same optional field Lifecome-mobile's personal-details step collects), not a live device
position. `GET /admin/locations` does this aggregation server-side; this page has no client-side
grouping logic of its own anymore.

This was a specific decision, not an oversight: `Lifecome-backend` has no location-tracking
endpoint to read from, and continuously tracking a patient's real-time location is sensitive
personal data under most healthcare privacy regimes (NDPR/GDPR-style) - it would need a clear
legal basis and explicit consent that "so staff can see where people are" doesn't obviously meet
for a platform whose care happens over video, not in person. If a real need for this shows up
later (e.g. dispatching an in-person visit), it should be scoped and reviewed on its own, not
built by defaulting a "location" feature request into live tracking.

## Design tokens

The brand palette, spacing and radii in `src/app/globals.css` are copied by hand from
`Lifecome-web/src/app/globals.css` rather than shared as a package - the two apps started from
the same file and are expected to drift only in the console's dark-mode-by-default choice (see the
comment in `globals.css`). If a third web app joins this workspace, that's the point to extract a
shared `@lifecome/tokens` package instead of copying a third time.

## What's next

1. `npm run generate:api` against a running backend, then replace each feature's hand-written
   `types.ts` with a re-export/narrowing of the generated types (the `patients/types.ts`-style
   pattern already used) - removes the risk of hand-written types drifting from the real contract.
2. Real server-side pagination in `DataTable` (or a lighter per-list variant) once any list
   plausibly exceeds the 100-row fetch this pass uses.
3. Build the "Compose broadcast" and "Invite staff member" forms - both buttons are disabled today
   but their backend endpoints already exist (`POST /admin/staff`; broadcast notifications would
   need a new backend endpoint, since `POST /notifications` only enqueues one recipient).
4. Build out `Scheduling`, `Consultations`, `Clinical records`, `Documents`, `Care coordination`,
   `Authorisations`, `Messaging` and `Settings` once `Lifecome-backend` gains admin endpoints for
   those modules.
5. A command palette (`cmdk` is already a dependency) for cross-module search from the topbar.
6. The `components/ui/` folder is still empty - add Radix-based primitives (dialog, select,
   dropdown, toast) as each is actually needed, rather than generating the full shadcn/ui set
   upfront.
