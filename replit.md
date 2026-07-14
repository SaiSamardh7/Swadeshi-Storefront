# Swadeshi Storefront

Customer-facing website for Swadeshi Plaza in Frisco: restaurant menu, grocery and halal-meat information, catering inquiries, and store details.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/swadeshi` — Vite/React storefront; routes are registered in `src/App.tsx`
- `artifacts/swadeshi/src/data/fullmenu.ts` — source of truth for displayed menu items and prices
- `artifacts/swadeshi/src/lib/business.ts` — source of truth for address, hours, contact, maps, and ordering links
- `artifacts/swadeshi/src/index.css` — Tailwind theme and global styles
- `artifacts/api-server` — Phase 2 Express API scaffold
- `lib/db/src/schema` — Phase 2 database schema
- `lib/api-spec/openapi.yaml` — API contract used to generate `lib/api-client-react` and `lib/api-zod`

## Architecture decisions

- The storefront currently reads local typed data; the API, database, and generated clients are retained for the planned Phase 2 backend.
- Business facts are centralized in `src/lib/business.ts` so pages do not drift on phone, address, hours, or order URL.
- Menu prices come from `src/data/fullmenu.ts`; promotional strips must derive from that dataset rather than duplicate prices.
- shadcn components are kept only when reachable; regenerate a removed primitive with the shadcn CLI when a feature needs it.

## Product

- Browse and search the restaurant menu, including vegetarian filtering.
- Review grocery, halal meat, catering, gallery, reviews, location, and contact information.
- Start an order through the restaurant's external POS ordering page.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use pnpm only; the root `preinstall` rejects npm and Yarn.
- Run `pnpm run typecheck` before `pnpm run build` or submitting changes.
- Menu vegetarian flags were inferred during extraction and should be owner-verified before being presented as authoritative dietary guidance.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
