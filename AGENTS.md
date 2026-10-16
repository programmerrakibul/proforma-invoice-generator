# Proforma Invoice Generator

Single-package Next.js 16 App Router app (React 19, Tailwind CSS v4, pnpm 12.10.1). Package manager is locked in `package.json` — always use `pnpm`, never `npm`/`yarn`.

## Developer commands

- `pnpm dev` — dev server (Turbopack; `next.config.ts` enables `@tailwindcss/turbopack` CSS loader)
- `pnpm build` — `next build`
- `pnpm start` — `next start`
- `pnpm lint` — `eslint` (no `--fix` script; run `pnpm exec eslint --fix` manually if needed)
- No `test` or `typecheck` script exists. Typecheck manually: `npx tsc --noEmit` (`tsconfig.json` already sets `noEmit`)

## Setup

1. `pnpm install`
2. Copy `.env.example` → `.env` (`.env*` is gitignored). Required: `MONGODB_URI` (default `mongodb://localhost:27017/proforma-invoice-generator`). `AUTH_SECRET` is a dev placeholder.
3. MongoDB must be running locally (or set `MONGODB_URI` to a reachable instance). No Docker Compose in repo — provision DB yourself.

## Architecture & wiring

- `src/app` — Next.js App Router. Route group `(dashboard)`; the invoice builder page is `src/app/(dashboard)/invoices/new/page.tsx`. Root `page.tsx` is the default Next welcome page (not the app).
- `src/features/invoices` — feature module: `actions/` (`"use server"` server actions), `schemas/` (zod `invoice.schema.ts`), `store/` (RTK `invoice-ui.slice.ts` for client UI state only), `components/`, `utils/`, `types.ts`.
- `src/lib/db/mongoose.ts` — cached Mongoose connection (`globalThis.mongooseCache`) to avoid reconnects on dev hot reload. **Call `connectToDatabase()` lazily inside server actions/loaders only — never from a client component or module import.**
- `src/lib/auth/` — temporary placeholder auth (fixed dev user). `requireUser()` throws if unauthenticated; never trust client-submitted user IDs. To be replaced with real auth later ("Prompt 10").
- `src/store/index.ts` — Redux Toolkit store (`invoiceUi` slice only). `src/store/provider.tsx` is the `"use client"` Redux provider.
- Path alias `@/*` → `./src/*`. shadcn aliases: `@/components`, `@/lib`, `@/lib/utils`, `@/components/ui`, `@/hooks`.

## Conventions to honor

- Server actions: mark `"use server"`, validate with zod, compute totals server-side (never trust client totals), call `requireUser()` to derive `ownerId`, then `revalidatePath()` after mutation. See `src/features/invoices/actions/create-invoice.ts` as the template.
- Server components by default (`components.json: "rsc": true`); add `"use client"` only when interactivity/providers require it.
- UI styling: Tailwind v4 + shadcn `base-mira`, CSS variables in `src/app/globals.css`, `cn()` from `@/lib/utils` (re-exports `cn` package).
- Cloudinary (`next-cloudinary`) and `multer` are dependencies — image upload flows exist but aren't wired in `src/app` yet.

## Verification order (when changing code)

`lint` → `npx tsc --noEmit` → `build`. No CI workflows or pre-commit config in repo.

## Generated / build artifacts

`.next/`, `out/`, `build/`, `coverage/`, `*.tsbuildinfo`, `next-env.d.ts` — all gitignored. Do not commit them.