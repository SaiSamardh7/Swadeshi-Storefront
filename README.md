# Swadeshi Storefront

Customer-facing website for **Swadeshi Plaza of Frisco** — an Indian grocery store, halal butcher, and quick-service kitchen in Frisco, Texas. The site lets visitors browse the restaurant menu, read about grocery/halal offerings, build a catering quote, view the gallery/reviews/location/contact info, and hand off to the restaurant's hosted ordering page.

It is a **pnpm monorepo** containing a Vite/React storefront (the currently-shipping product) plus a full Phase 2 backend scaffold (Express API, PostgreSQL/Drizzle schema, and generated typed API clients) that is retained for a planned native ordering flow.

> This README is a complete reference to the repository — it walks through every workspace package, every file, every database table and column, every API endpoint, and every storefront page/component/hook/config. For deployment gates and the security audit, see [`docs/LAUNCH_READINESS.md`](docs/LAUNCH_READINESS.md) and [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md).

---

## Table of contents

- [Quick start](#quick-start)
- [Tech stack](#tech-stack)
- [Two phases: what ships today vs. what is scaffolded](#two-phases)
- [Repository layout](#repository-layout)
- [Root configuration files](#root-configuration-files)
- [Workspace packages (`lib/`)](#workspace-packages-lib)
  - [`@workspace/menu`](#workspacemenu)
  - [`@workspace/db`](#workspacedb)
  - [`@workspace/api-spec`](#workspaceapi-spec)
  - [`@workspace/api-zod`](#workspaceapi-zod)
  - [`@workspace/api-client-react`](#workspaceapi-client-react)
- [Applications (`artifacts/`)](#applications-artifacts)
  - [`@workspace/api-server`](#workspaceapi-server)
  - [`@workspace/swadeshi` (storefront)](#workspaceswadeshi-storefront)
- [Scripts (`scripts/`)](#scripts-scripts)
- [Data model reference](#data-model-reference)
- [HTTP API reference](#http-api-reference)
- [Money, IDs, and other conventions](#conventions)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Docs & attached assets](#docs--attached-assets)

---

## Quick start

This repo uses **pnpm only** (a root `preinstall` hook rejects npm and Yarn) and Node.js 24.

```bash
# 1. Install dependencies (pnpm >= 10)
pnpm install

# 2. Run the storefront (Vite dev server)
pnpm --filter @workspace/swadeshi run dev

# 3. (Optional) run the Phase 2 API server — needs a Postgres DATABASE_URL
pnpm --filter @workspace/api-server run dev
```

Common workspace commands:

| Command | What it does |
| --- | --- |
| `pnpm run typecheck` | Full typecheck across all packages (libs first via `tsc --build`, then apps/scripts). |
| `pnpm run build` | `typecheck` + build every package that defines a `build` script. |
| `pnpm --filter @workspace/swadeshi run dev` | Storefront dev server (`vite`, host `0.0.0.0`). |
| `pnpm --filter @workspace/swadeshi run build` | Production build → `artifacts/swadeshi/dist/public`. |
| `pnpm --filter @workspace/api-server run dev` | Build + start the Express API (port from `PORT`). |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate the React-Query hooks and Zod schemas from `openapi.yaml`. |
| `pnpm --filter @workspace/db run push` | Push the Drizzle schema to the database (dev only). |

Required env for the backend: `DATABASE_URL` (a Postgres connection string).

---

## Tech stack

- **Package manager / runtime:** pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend:** Vite + React 18, `wouter` (routing), `@tanstack/react-query` (server state), Tailwind CSS v4, shadcn/ui (Radix primitives + `class-variance-authority`), `lucide-react` icons, `embla-carousel-react`, `react-hook-form`
- **Backend:** Express 5, `cookie-parser`, `cors`, `pino`/`pino-http` logging
- **Database:** PostgreSQL via Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `pg`)
- **Validation:** Zod (`zod/v4`) + `drizzle-zod`
- **API contract & codegen:** OpenAPI 3 spec → [Orval](https://orval.dev/) → React-Query client (`api-client-react`) and Zod validators (`api-zod`)
- **Backend bundling:** esbuild (ESM output; `esbuild-plugin-pino` for logger workers)
- **Email:** Resend (via plain `fetch`, no SDK)

---

## Two phases

The repo deliberately contains more than what is live. Reading the code, keep this split in mind (documented in `docs/LAUNCH_READINESS.md`):

- **Phase 1 — what ships today (the storefront).** A static Vite/React site. It reads a **local, typed menu** and **local business facts**, and its food-order buttons hand off to the restaurant's **externally-hosted Heartland ordering page** (`swadeshifrisco.hrpos.heartland.us`). No payment data is collected by this app. This is the deployable product (AWS Amplify static hosting).
- **Phase 2 — scaffolded but gated (the backend).** A full Express API + Postgres schema + generated clients for a native cart, phone-OTP login, pickup orders, a catering-lead pipeline, live menu overrides (sold-out / repricing), and a staff admin board. The storefront already imports the generated hooks (e.g. `useGetMe`, `useCreateCateringRequest`), so several pages are wired to this API when it is running. Phase 2 is **not approved to go live** until Heartland gateway/kitchen-routing gates are met.

---

## Repository layout

```
Swadeshi-Storefront/
├── package.json                 # workspace root (scripts, dev deps, pnpm guard)
├── pnpm-workspace.yaml          # workspace globs + dependency catalog + supply-chain guard
├── tsconfig.base.json           # shared strict TS compiler options
├── tsconfig.json                # solution-style project references (the lib/* packages)
├── amplify.yml                  # AWS Amplify build spec (builds the storefront)
├── customHttp.yml               # Amplify security headers + cache-control (CSP, HSTS, …)
├── .replit / .replitignore      # Replit runtime, ports, postMerge hook
├── .npmrc                       # pnpm registry/config
├── docs/                        # launch readiness + security/production audit
├── attached_assets/             # logo masters + a legacy Next.js page/button guide
├── scripts/                     # tiny workspace-utility package (@workspace/scripts)
├── lib/                         # shared workspace packages (no user-facing UI)
│   ├── menu/                    # @workspace/menu  — the authoritative menu + catering catalog
│   ├── db/                      # @workspace/db    — Drizzle schema + connection
│   ├── api-spec/                # @workspace/api-spec — OpenAPI spec + Orval codegen config
│   ├── api-zod/                 # @workspace/api-zod — generated Zod request/response schemas
│   └── api-client-react/        # @workspace/api-client-react — generated React-Query hooks + fetch mutator
└── artifacts/                   # deployable applications ("artifacts" in Replit terms)
    ├── api-server/              # @workspace/api-server — Express 5 API (Phase 2)
    └── swadeshi/                # @workspace/swadeshi   — Vite/React storefront (Phase 1)
```

> `.local/` (Replit skills) and `node_modules/` are tooling/dependency directories, not application code, and are git-ignored.

---

## Root configuration files

### `package.json` (root)
The private workspace root. Key parts:

- `packageManager: "pnpm@10.33.2"` pins the package manager.
- **`preinstall`** script: deletes any stray `package-lock.json`/`yarn.lock` and hard-fails unless the installer is pnpm — this is the "pnpm only" guard.
- **`build`**: runs `typecheck`, then `pnpm -r --if-present run build` (recursive build across packages).
- **`typecheck:libs`**: `tsc --build` (project-reference build of the `lib/*` packages).
- **`typecheck`**: builds the libs, then typechecks the artifacts and scripts.
- Dev deps: `prettier`, `typescript`. Runtime dep: `@replit/connectors-sdk`.

### `pnpm-workspace.yaml`
Defines the workspace and two important cross-cutting settings:

- A **dependency catalog** (`catalog:`) — shared versions of React, Vite, Tailwind, Zod, Drizzle, React-Query, TanStack, etc. Packages reference `"catalog:"` instead of pinning versions individually, so upgrades happen in one place.
- **`minimumReleaseAge: 1440`** — a supply-chain defense: pnpm refuses to install any npm package version published less than 1 day (1440 min) ago, so freshly-published malicious releases can't be pulled in. There's a documented `minimumReleaseAgeExclude` allowlist for trusted urgent exceptions. The header comment warns strongly against disabling it.

### `tsconfig.base.json`
Shared compiler options extended by every package. Notable: strict-ish setup (`strictNullChecks`, `noImplicitAny`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `alwaysStrict`, `useUnknownInCatchVariables`), `module`/`moduleResolution` = `esnext`/`bundler`, `target: es2022`, `incremental` + `isolatedModules`, `skipLibCheck`, and a custom resolution condition `["workspace"]` so workspace packages resolve to their `src` during typechecking.

### `tsconfig.json` (root)
A solution-style config with **project references** to the four buildable libs (`lib/db`, `lib/menu`, `lib/api-client-react`, `lib/api-zod`). `pnpm run typecheck:libs` (`tsc --build`) uses this.

### `amplify.yml`
AWS Amplify Hosting build spec. `preBuild` enables corepack, sets the pnpm store dir, and does a frozen-lockfile install. `build` typechecks and builds **only the storefront**, injecting `PORT=8080 BASE_PATH=/` because `vite.config.ts` requires them (Replit injects these automatically; Amplify doesn't). Publishes `artifacts/swadeshi/dist/public` and caches the pnpm store.

### `customHttp.yml`
Amplify response headers. Applies a strict **Content-Security-Policy**, **HSTS**, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, and a locked-down `Permissions-Policy` to all routes; long-lived immutable caching for `/assets/*`; and `no-cache` for `index.html`. The CSP allowlists Google Fonts and a Google Maps `frame-src` (used by the location embed).

### `.replit` / `.replitignore`
Replit runtime config: Node 24, autoscale deployment, a `postMerge` hook (`scripts/post-merge.sh`), and port mappings (8080→8080, 8081→80, 19537→3000). `.replitignore` excludes noise from the Replit workspace.

### `.npmrc`
pnpm/registry configuration.

---

## Workspace packages (`lib/`)

These are internal packages (all `private`, version `0.0.0`, ESM). They're consumed via `workspace:*` and exposed to TypeScript through the `"workspace"` custom condition, so imports resolve straight to `src`.

### `@workspace/menu`

**The single source of truth for food and catering data.** Both the storefront (display) and the API server (authoritative pricing) import it, so prices never drift between UI and backend.

- **`src/index.ts`** — the à-la-carte restaurant menu.
  - Types: `FullMenuItem` (`{ name, price, isVeg }`), `FullMenuCategory` (`{ category, items[] }`), `FullMenuSection` (`{ section, categories[] }`).
  - `FULL_MENU: FullMenuSection[]` — the entire published menu, extracted from swadeshius.com (≈9 sections: Tiffins & Breakfast, Appetizers & Snacks, Curries & Breads, Biryanis, Pulavs, Chaat & Street Food, Chettinad Specials, Indo-Chinese, Drinks & Desserts). Prices are in **dollars** here. A header comment flags that `isVeg` was **inferred** from category + dish-name keywords (ambiguous names biased to non-veg so the Veg filter never shows meat) and should be owner-verified.
  - `slug(s)` — lowercases and hyphenates a string.
  - `menuItemId(category, name)` — builds a **stable id** as `${slug(category)}-${slug(name)}`, so identical dish names in different categories stay distinct. Both storefront (add-to-cart) and server (price lookup) call this to compute the exact same id.
  - `CatalogEntry` (`{ id, name, priceCents, isVeg, category }`) + `buildCatalog()` — lazily builds a `Map<id, CatalogEntry>`, converting dollar prices to **cents** (`Math.round(price*100)`); first occurrence of a duplicate id wins.
  - `getMenuItem(id)` — the authoritative price/name lookup the API server uses to price orders instead of trusting client-supplied prices.
  - Re-exports `./catering`.
- **`src/catering.ts`** — the catering tray catalog and pricing helpers.
  - `CateringTray` (`{ id, name, category, isVeg, halfCents, fullCents, servesHalf, servesFull }`) and `TraySize` (`"half" | "full"`).
  - `CATERING_TRAYS: CateringTray[]` — trays grouped by category (Appetizers, Biryani & Rice, Veg/Non-Veg Entrees, Breads, Desserts). **All prices are cents and are explicitly PLACEHOLDERS** — a large header comment says they were not supplied by the restaurant and must be replaced before going live.
  - `getCateringTray(id)` — lazily-indexed authoritative tray lookup (used by the server to re-price submitted quotes).
  - `trayPriceCents(tray, size)` / `trayServes(tray, size)` — pick half vs. full price / serving estimate.

### `@workspace/db`

Drizzle ORM schema and the shared Postgres connection.

- **`src/index.ts`** — throws if `DATABASE_URL` is unset, creates a `pg.Pool`, exports `db = drizzle(pool, { schema })`, and re-exports the whole schema.
- **`drizzle.config.ts`** — `drizzle-kit` config (postgresql dialect, schema at `src/schema/index.ts`, credentials from `DATABASE_URL`). Backs the `push` / `push-force` scripts.
- **`src/schema/`** — one file per table, re-exported from `index.ts`:
  - **`users.ts`** — `usersTable` (`id` serial PK, `phone` unique E.164, nullable `name`, `createdAt`). Phone is the only login identity. Exports `insertUserSchema` (drizzle-zod), `InsertUser`, `User`.
  - **`otp-codes.ts`** — `otpCodesTable`, keyed by `phone` (one pending code per phone): `codeHash`, `expiresAt`, `attempts` (default 0), `sentAt`. A new request overwrites the old one.
  - **`sessions.ts`** — `sessionsTable` (`token` PK, `userId` FK → users `onDelete: cascade`, `expiresAt`). Customer session store.
  - **`orders.ts`** — `ordersTable` (`id`, `userId` FK, `status`, `pickupName`, nullable `note`, `subtotalCents`, `pickupEta`, `createdAt`). `ORDER_STATUSES = ["new","preparing","ready","picked_up"]` + `OrderStatus` type. Status is staff-driven from the admin board (no payment/POS webhook). Exports `insertOrderSchema`, `InsertOrder`, `Order`.
  - **`order-items.ts`** — `orderItemsTable` (`id`, `orderId` FK cascade, `itemId`, `name`, `unitPriceCents`, `qty`). A **snapshot** of name/price at order time so menu changes don't rewrite history. Exports `insertOrderItemSchema`, `InsertOrderItem`, `OrderItem`.
  - **`store.ts`** — two staff-controlled tables:
    - `menuOverridesTable` (`itemId` PK, `soldOut` bool, nullable `priceCents`, `updatedAt`) — a row exists only while an item differs from the printed menu; resetting deletes the row.
    - `storeSettingsTable` (`id` always `1`, `orderingPaused` bool) — a single-row table of store-wide switches.
  - **`catering.ts`** — the catering lead pipeline:
    - `CATERING_STATUSES = ["new","contacted","quoted","closed"]` + `CateringStatus`.
    - `cateringRequestsTable` (`id`, `status` default `new`, `name`, `phone`, `email`, `eventDate`, `eventType`, `guestCount`, nullable `note`, `estimateCents` (server-computed, never trusted from browser), `createdAt`).
    - `cateringRequestItemsTable` (`id`, `requestId` FK cascade, `trayId`, `name`, `size` `half`/`full`, `qty`, `unitPriceCents`).
    - Exports `CateringRequest`, `CateringRequestItem` row types.

### `@workspace/api-spec`

The **API contract** and codegen configuration. Not shipped; a build-time tool.

- **`openapi.yaml`** — the OpenAPI 3 document describing every endpoint (health, auth/OTP, orders, live menu state, catering, and the staff admin routes) plus all request/response schemas. This is the source of truth that generates the two client packages.
- **`orval.config.ts`** — Orval config with two outputs:
  - `api-client-react` → `react-query` client, split mode, `baseUrl: "/api"`, using the custom `customFetch` mutator (see below).
  - `zod` → TypeScript Zod schemas + types under `generated/types`, with coercion rules and `useDates`/`useBigInt`.
  - A `titleTransformer` forces the spec title to `"Api"` so the generated file is `api.ts` (the package exports assume that name).
- **`codegen` script**: `orval` then `pnpm -w run typecheck:libs`.

> The `generated/` directories in the two packages below are **produced by this codegen** — edit `openapi.yaml` and re-run codegen rather than editing generated files by hand.

### `@workspace/api-zod`

Generated Zod validators used by the **API server** to `safeParse` request bodies/params and to `parse` (shape/serialize) responses. `src/index.ts` re-exports `./generated/api` (per-operation schemas like `AdminLoginBody`, `CreateOrderResponse`) and `./generated/types` (shared schemas like `Order`, `MenuState`, `CateringRequest`).

### `@workspace/api-client-react`

Generated **React-Query hooks** the storefront calls (`useGetMe`, `useCreateOrder`, `useGetMenuState`, `useCreateCateringRequest`, `useAdminLogin`, `useGetAdminOrders`, `useUpdateOrderStatus`, `useUpdateMenuOverride`, `useUpdateStoreState`, `useGetAdminCateringRequests`, `useUpdateCateringStatus`, and their query-key helpers/types).

- **`src/generated/`** — Orval output: `api.ts` (hooks) and `api.schemas.ts` (TS types).
- **`src/custom-fetch.ts`** — the hand-written fetch **mutator** every generated hook runs through. It is the most substantial hand-written file in the client and handles the realities of running the same client in both browsers and React Native:
  - `setBaseUrl(url)` / `setAuthTokenGetter(getter)` — module-level config. Base URL is prepended only to relative (`/`-leading) paths; the auth-token getter attaches `Authorization: Bearer …` (intended for token-gated Expo bundles — **web apps rely on session cookies instead**, so they should not use it).
  - `customFetch<T>(input, options)` — the core: applies the base URL, resolves the HTTP method, rejects bodies on GET/HEAD, merges headers, auto-sets `content-type: application/json` when the body looks like JSON, sets a JSON `accept` header, optionally attaches the bearer token, then `fetch`es. On non-2xx it parses the error body and throws an `ApiError`; otherwise it parses the success body by content-type (`json`/`text`/`blob`/`auto`).
  - Robust body parsing: BOM stripping, `looksLikeJson`, media-type detection, and a `hasNoBody` check that uses strict equality specifically because React Native's `response.body` is always `undefined`.
  - Error classes: `ApiError<T>` (status, statusText, parsed `data`, headers, method, url; builds a readable message from RFC-7807 `title`/`detail` or common `message`/`error` fields) and `ResponseParseError` (thrown when a success body can't be parsed as JSON, preserving the raw body and cause).
  - `src/index.ts` re-exports the generated hooks/schemas plus `setBaseUrl`, `setAuthTokenGetter`, and the `AuthTokenGetter` type.

---

## Applications (`artifacts/`)

### `@workspace/api-server`

Express 5 API for Phase 2. Every route validates input with `@workspace/api-zod`, prices from `@workspace/menu` (never trusting client prices), and persists with `@workspace/db`.

**Entry & wiring**

- **`src/index.ts`** — reads `PORT` (required; throws if missing/invalid) and starts the server, logging via pino.
- **`src/app.ts`** — builds the Express app: `pino-http` request logging (with slim req/res serializers), `cors({ origin: true, credentials: true })` (reflects Origin so session cookies work cross-origin in dev), `cookie-parser`, JSON + urlencoded body parsers, and mounts the router under **`/api`**.
- **`build.mjs`** — esbuild bundle to ESM (`dist/index.mjs`), Node platform, with a long `external` list of native/unbundleable packages, source maps, and `esbuild-plugin-pino` (so pino's worker transports resolve). A `banner` re-creates `require`/`__filename`/`__dirname` so bundled CJS-only deps (e.g. Express) work in the ESM output.
- **`.replit-artifact/artifact.toml`** — declares this as an `api` artifact: dev runs `pnpm --filter @workspace/api-server run dev`; production builds and runs `node dist/index.mjs` on `PORT=8080` with a `/api/healthz` startup health check.

**Routes (`src/routes/`)** — all mounted under `/api`:

- **`index.ts`** — combines the routers below (health, auth, menu, catering, orders, admin).
- **`health.ts`** — `GET /healthz` → `{ status: "ok" }`.
- **`auth.ts`** — phone-OTP auth:
  - `POST /auth/request-code` — validates an E.164 phone (`/^\+[1-9]\d{7,14}$/`), enforces a resend cooldown (429), issues a code, and "sends" the SMS.
  - `POST /auth/verify-code` — verifies the code, upserts the user by phone, creates a session, and sets the session cookie.
  - `GET /auth/me` — returns the current user or `null`.
  - `POST /auth/logout` — destroys the session and clears the cookie.
- **`menu.ts`** — `GET /menu/state` (public): returns `{ orderingPaused, overrides[] }` so the storefront can merge live sold-out/repricing over the static catalog without a redeploy.
- **`orders.ts`** — pickup orders (login required):
  - `POST /orders` — refuses if `orderingPaused`; re-prices every line from the server catalog with staff overrides applied (sold-out items are rejected by name); computes `subtotalCents`; sets `pickupEta = now + 30 min`; inserts the order + item snapshots; emails a kitchen ticket. `201` with the created order.
  - `GET /orders/mine` — the caller's orders (newest first) with their items.
- **`catering.ts`** — `POST /catering/requests` (no login): rate-limited (10 / 10 min per IP); re-prices each requested tray from the server catalog; sums `estimateCents`; inserts the request + items; emails the owner a formatted lead; `201` with the created request. Includes a `formatLead()` helper that writes a plain-text summary and explicitly labels the total an estimate.
- **`admin.ts`** — the staff board (all require an admin session):
  - `POST /admin/login` (single shared password, constant-time compared) / `POST /admin/logout`.
  - `GET /admin/orders` and `POST /admin/orders/:id/status` (advance order status).
  - `PUT /admin/menu/overrides/:itemId` (set sold-out / price override; validates the item exists in the catalog).
  - `POST /admin/store` (pause/resume online ordering).
  - `GET /admin/catering` and `POST /admin/catering/:id/status` (advance a lead's status).

**Libraries (`src/lib/`)**

- **`logger.ts`** — pino logger; redacts `authorization`/`cookie`/`set-cookie`; pretty-prints in dev, JSON in prod; level from `LOG_LEVEL`.
- **`session.ts`** — customer sessions in the `sessions` table: `createSession`, `setSessionCookie` / `clearSessionCookie` (httpOnly, `sameSite: lax`, `secure` in prod, 30-day TTL), `getSessionUser` (joins session→user, expires stale rows), `destroySession`. Cookie name from `SESSION_COOKIE_NAME` (default `swadeshi_session`).
- **`admin-session.ts`** — staff sessions **in-memory** (a `Map`, cleared on restart), 12-hour TTL ("one shift"). `adminConfigured()` (is `ADMIN_PASSWORD` set), `checkPassword()` (constant-time `timingSafeEqual`), `createAdminSession`/`isAdmin`/`destroyAdminSession`. Cookie `swadeshi_admin_session`.
- **`otp.ts`** — OTP lifecycle backed by `otp_codes`: `hashCode` (SHA-256 of `phone:code`), `isResendTooSoon` (60s cooldown, keyed by phone so it survives behind a proxy), `issueCode` (6-digit, 10-min TTL, upsert), `verifyCode` (expiry/attempt checks, max 5 attempts, single-use — deleted on success).
- **`sms.ts`** — `sendOtpSms` currently **logs the code to the console** (no SMS provider wired). Documented swap-in point for Twilio/SNS.
- **`mailer.ts`** — `sendBusinessEmail(subject, text)` via Resend REST (`RESEND_API_KEY` + `BUSINESS_EMAIL`). If unconfigured or on failure it logs instead and returns `false`, so an order/lead never fails because email is down.
- **`store-state.ts`** — reads/writes the `store_settings` and `menu_overrides` tables: `getStoreSettings`, `setOrderingPaused`, `listMenuOverrides`, `setMenuOverride` (a "reset" — not sold-out and null price — deletes the row instead of storing a no-op).
- **`rate-limit.ts`** — an in-memory fixed-window limiter: `allow(key, limit, windowMs)`, an Express `rateLimited(req,res,bucket,limit,windowMs)` helper (sends 429), a `sweep` to bound memory, and `resetRateLimits` (test seam). Comments document its two ceilings (per-process; shared IP behind a proxy without `trust proxy`).
- **`rate-limit.test.ts`** — a dependency-free `node:test` self-check (first N allowed then blocked, keys independent, window reopens after expiry).
- **`middlewares/`** — placeholder (`.gitkeep`).

### `@workspace/swadeshi` (storefront)

The Vite/React single-page app — the Phase 1 deployable.

**Config & entry**

- **`vite.config.ts`** — React + Tailwind v4 + (dev-only) Replit plugins (runtime error overlay, cartographer, dev banner). Requires `PORT` and reads `BASE_PATH`; aliases `@` → `src` and `@assets` → the repo `attached_assets`; builds to `dist/public`; dev server proxies `/api` → `API_PROXY_TARGET` (default `http://localhost:5050`) so cookies stay same-origin.
- **`index.html`** — document shell: title/description, SEO + Open Graph + Twitter meta, `theme-color`, favicon, Google Fonts (Inter) preconnect/link, and the `#root` mount + `src/main.tsx` module script.
- **`components.json`** — shadcn/ui config (new-york style, neutral base, CSS variables, path aliases).
- **`src/main.tsx`** — mounts `<App/>` into `#root` and imports `index.css`.
- **`src/App.tsx`** — providers + routing. Wraps everything in `QueryClientProvider` → `CartProvider` → wouter `Router` (base from `BASE_URL`). Every page is **lazy-loaded** (`React.lazy` + `Suspense` fallback), wrapped in `<Layout>`. Routes: `/`, `/menu`, `/grocery-halal`, `/catering`, `/about`, `/location`, `/contact`, `/gallery`, `/reviews`, `/login`, `/cart`, `/checkout`, `/admin`, and a catch-all Not-Found.
- **`src/index.css`** — Tailwind v4 entry: imports Tailwind, `tw-animate-css`, and the typography plugin; maps shadcn design tokens to CSS variables in `@theme inline`; defines the light/dark palettes (a cream/off-white background with an orange primary, matching the `#ff8a33` theme color) and global styles.

**Shared code**

- **`src/lib/business.ts`** — the **single source of truth for business facts**: `BUSINESS` (name, tagline, address parts, phone display/tel, email, website, Facebook/Instagram, Google Maps URL + embed, the Heartland `orderUrl`, Grubhub grocery URL, marketplace delivery URL, and confirmed `hours`), the five `LOCATIONS` (Frisco is primary; four others by map pin), and `ORDER_HREF`/`ORDER_LABEL`. Pages import from here so contact details never drift. A comment marks the Heartland URL as the Phase 1 checkout boundary.
- **`src/lib/utils.ts`** — `cn(...)` (clsx + tailwind-merge) and `formatCents(cents)` (the one place money becomes a display string).
- **`src/lib/query-client.ts`** — the shared React-Query `QueryClient`.
- **`src/hooks/use-cart.tsx`** — the cart context: `CartItem` type, `CartProvider` (state persisted to `localStorage` under `swadeshi_cart`), and `useCart()` exposing `items`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, and memoized `itemCount`/`subtotalCents`. Prices are in cents.
- **`src/data/menu-display.ts`** — presentation-only helpers that map each `FULL_MENU` item to a **photo** (`getMenuItemPhoto`) and **description** (`getMenuItemDescription`) using ordered regex matches (specific dishes beat broad category fallbacks). Keeps imagery/copy out of the authoritative menu data.

**Components**

- **`components/layout.tsx`** — the app shell: sticky header (logo, desktop nav, cart button with live badge from `useCart`, an account/login link driven by `useGetMe`, and the "Order Online" CTA → Heartland), the page `<main>`, a 5-column footer (explore links, quick links, contact/hours from `BUSINESS`, trust badges), and a mobile bottom action bar (Home / Menu / Order / Location).
- **`components/veg-dot.tsx`** — `VegDot({ isVeg })`, the green/red square used on both the menu and catering pages so "vegetarian" looks identical in both places.
- **`components/ui/`** — shadcn/ui primitives kept only where reachable: `button`, `card`, `form`, `input`, `label`, `select`, `textarea`.

**Pages (`src/pages/`)**

| Route | File | What it does |
| --- | --- | --- |
| `/` | `home.tsx` | Hero + trust badges, a popular-items carousel (`embla-carousel-react`) whose items are pulled from `FULL_MENU` (real names/prices, not invented), and section CTAs. |
| `/menu` | `menu.tsx` | Full searchable menu. Flattens `FULL_MENU` into items (with photo + description + stable `menuItemId`), supports search and a veg filter, a "Popular" strip, and add-to-cart. Merges live `useGetMenuState` overrides (sold-out / repriced) over the static catalog. |
| `/grocery-halal` | `grocery-halal.tsx` | Grocery + halal-meat info page (imagery + copy + order-groceries handoff to Grubhub). |
| `/catering` | `catering.tsx` | The catering **quote builder**: pick trays (half/full, quantity) from `CATERING_TRAYS` with a veg filter and serving estimates, fill an event form, and submit via `useCreateCateringRequest`. The server re-prices and emails the lead. |
| `/about` | `about.tsx` | Brand/story page. |
| `/location` | `location.tsx` | All `LOCATIONS`, hours, and the Google Maps embed. |
| `/contact` | `contact.tsx` | Contact details + form (email-draft handoff; the site does not store form details — see audit). |
| `/gallery` | `gallery.tsx` | Photo gallery from `public/images`. |
| `/reviews` | `reviews.tsx` | Customer reviews (fabricated testimonials were removed per the audit). |
| `/login` | `login.tsx` | Phone-OTP login. `normalizePhone` turns a typed 10-digit US number into E.164 (`+1…`); `useRequestCode` then `useVerifyCode`; on success invalidates the `me` query and navigates to `?next` (default `/cart`). |
| `/cart` | `cart.tsx` | Cart review backed by `useCart` (quantities, remove, subtotal via `formatCents`). |
| `/checkout` | `checkout.tsx` | Pickup checkout: requires login (`useGetMe`), blocks when `orderingPaused`, submits via `useCreateOrder`, shows the pickup ETA (America/Chicago), and clears the cart on success. |
| `/admin` | `admin.tsx` | Staff board: `useAdminLogin`/`useAdminLogout`, live orders (`useGetAdminOrders` + `useUpdateOrderStatus` advancing new→preparing→ready→picked_up), menu overrides (`useUpdateMenuOverride`), pause/resume ordering (`useUpdateStoreState`), and the catering pipeline (`useGetAdminCateringRequests` + `useUpdateCateringStatus`). |
| * | `not-found.tsx` | 404 fallback. |

**Assets**

- `src/assets/swadeshi-logo.png` — the header/footer logo.
- `public/favicon.svg`, `public/robots.txt`.
- `public/images/*.jpg` — hero/section photography (biryani, dosa, paneer, halal case, storefront, thali, etc.).
- `public/images/menu/*.jpg` — per-dish studio photos referenced by `menu-display.ts`. (PNG masters are git-ignored; compressed JPEGs are committed.)
- `.replit-artifact/artifact.toml` — declares a `web` artifact: dev via the storefront `dev` script, production static build served from `dist/public` with an SPA rewrite (`/* → /index.html`); sets `PORT`/`BASE_PATH`.

---

## Scripts (`scripts/`)

`@workspace/scripts` — a minimal utility package. `src/hello.ts` is a placeholder run via `pnpm --filter @workspace/scripts run hello` (`tsx`). Also exposes `typecheck`.

`scripts/post-merge.sh` — the Replit `postMerge` hook: `pnpm install --frozen-lockfile` then `pnpm --filter db push` (applies DB schema changes after a merge).

---

## Data model reference

```
users (id, phone unique E.164, name?, createdAt)
  └─< sessions (token PK, userId→users, expiresAt)
  └─< orders (id, userId→users, status, pickupName, note?, subtotalCents, pickupEta, createdAt)
         └─< order_items (id, orderId→orders, itemId, name, unitPriceCents, qty)   ← price/name snapshot

otp_codes (phone PK, codeHash, expiresAt, attempts, sentAt)     ← one pending code per phone

menu_overrides (itemId PK, soldOut, priceCents?, updatedAt)     ← only present when item differs from menu
store_settings (id=1, orderingPaused)                           ← single-row store switches

catering_requests (id, status, name, phone, email, eventDate, eventType, guestCount, note?, estimateCents, createdAt)
  └─< catering_request_items (id, requestId→catering_requests, trayId, name, size, qty, unitPriceCents)
```

- **Order status:** `new → preparing → ready → picked_up` (staff-advanced).
- **Catering status:** `new → contacted → quoted → closed`.
- All `→` foreign keys use `onDelete: cascade`.
- Money is stored in **integer cents** everywhere in the DB and API.

---

## HTTP API reference

All endpoints are mounted under **`/api`** (see `openapi.yaml` for exact schemas).

| Method & path | Auth | Purpose |
| --- | --- | --- |
| `GET /healthz` | — | Health check → `{ status: "ok" }`. |
| `POST /auth/request-code` | — | Send an OTP to a phone (rate-limited by resend cooldown). |
| `POST /auth/verify-code` | — | Verify OTP, upsert user, start a session. |
| `GET /auth/me` | cookie | Current user or `null`. |
| `POST /auth/logout` | cookie | End the session. |
| `POST /orders` | customer | Place a pickup order (server-priced; blocked when paused). |
| `GET /orders/mine` | customer | The caller's orders + items. |
| `GET /menu/state` | — | Live sold-out/price overrides + ordering-paused flag. |
| `POST /catering/requests` | — | Submit a catering quote (rate-limited; server-priced; emails owner). |
| `POST /admin/login` · `POST /admin/logout` | admin pw | Staff session start/end. |
| `GET /admin/orders` · `POST /admin/orders/{id}/status` | admin | List / advance orders. |
| `PUT /admin/menu/overrides/{itemId}` | admin | Set sold-out / price override. |
| `POST /admin/store` | admin | Pause / resume online ordering. |
| `GET /admin/catering` · `POST /admin/catering/{id}/status` | admin | List / advance catering leads. |

Guarantees enforced server-side: **prices are always recomputed** from `@workspace/menu` (client-sent prices/names are ignored), sold-out items are rejected, catering estimates are server-computed, and the customer never pays online (pay-at-pickup only).

---

## Conventions

- **Money in cents.** DB, API, and cart all use integer cents; `formatCents()` (storefront) is the only place it becomes a `$` string. `@workspace/menu`'s display prices are in dollars and are converted to cents in `buildCatalog()`.
- **Never trust client prices.** Orders and catering quotes are re-priced from the server-side catalog by `itemId`/`trayId`.
- **Stable ids.** `menuItemId(category, name)` is computed identically on both sides so add-to-cart ids match server lookups.
- **Centralized business facts and menu data.** Pages import from `src/lib/business.ts` and `@workspace/menu`; they must not hard-code prices, addresses, or the order URL.
- **Generated code is generated.** Don't edit `lib/api-zod/src/generated` or `lib/api-client-react/src/generated`; change `openapi.yaml` and run codegen.
- **pnpm only, typecheck before build.** Enforced by the root `preinstall` guard and the `build` script order.
- **`isVeg` and catering prices are provisional.** Veg flags were inferred; catering tray prices are placeholders — both need owner verification before being treated as authoritative.

---

## Environment variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `@workspace/db`, api-server | Postgres connection string. Required for the backend. |
| `PORT` | api-server, storefront vite | Required by both (Replit injects it; Amplify build sets it explicitly). |
| `BASE_PATH` | storefront vite | Base path for the build (`/` in production). |
| `NODE_ENV` | api-server, vite | `production` toggles secure cookies, JSON logging, and drops dev-only Vite plugins. |
| `SESSION_COOKIE_NAME` | api-server | Optional; defaults to `swadeshi_session`. |
| `ADMIN_PASSWORD` | api-server | The single staff password for `/admin`. Admin login is disabled if unset. |
| `RESEND_API_KEY`, `BUSINESS_EMAIL` | api-server mailer | Enable real email; without them, messages are logged instead. |
| `LOG_LEVEL` | api-server logger | pino level; defaults to `info`. |
| `API_PROXY_TARGET` | storefront dev | Where the dev server proxies `/api` (default `http://localhost:5050`). |

Secrets (`.env`, `artifacts/*/.env`) are git-ignored — never commit them.

---

## Deployment

- **Storefront (Phase 1):** built by `amplify.yml`, published from `artifacts/swadeshi/dist/public`, with security headers from `customHttp.yml`. AWS Amplify requires a manual **SPA 200-rewrite** rule (exact regex in `docs/LAUNCH_READINESS.md`) so deep links like `/menu` resolve to `index.html`. Full step-by-step and a GitHub-free manual-upload path are in that doc.
- **API server (Phase 2):** built by `build.mjs` to `dist/index.mjs` and started with `node --enable-source-maps`; the Replit artifact config runs it on `PORT=8080` with a `/api/healthz` startup check. Not approved for production until the Heartland gateway/kitchen-routing gates in `LAUNCH_READINESS.md` are met.

---

## Docs & attached assets

- **`docs/LAUNCH_READINESS.md`** — Phase 1 launch checklist (Amplify deploy, required SPA rewrite, domain steps) and the four Phase 2 evidence gates (Heartland Online Ordering, gateway/HPP, order→kitchen workflow, MID/product) that must all be met before native ordering is built.
- **`docs/AUDIT_REPORT.md`** — a production-readiness + security audit (scored 84/100, "launchable with caveats"): fixed launch risks, verification evidence, remaining caveats, and a Trivy scan (0 vulnerabilities/secrets/misconfigs on both source and the shipped artifact).
- **`attached_assets/`** — logo master PNGs and `SWADESHI_PAGE_AND_BUTTON_GUIDE_*.md`, a line-by-line guide to the **previous Next.js** version of the site (historical reference; the current app is the Vite storefront described above).

---

_Swadeshi Plaza of Frisco · 14300 State Hwy 121 #100, Frisco, TX 75035 · (469) 294-3500_
