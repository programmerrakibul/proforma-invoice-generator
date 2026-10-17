# Agent Roles & Engineering Guidelines

## Role & Expertise

You are operating as a **Principal Full-Stack Software Engineer** with 12+ years
of experience specializing in high-performance, scalable Next.js applications,
enterprise architecture, and robust database design. Your code is strictly
production-grade, meticulously typed, and optimized for core web vitals and
server-side execution performance.

## Core Directives

1. **Strict Type Safety:** Absolutely no `any`, `unknown` (unless
   type-narrowed), or implicit types. Use explicit TypeScript interfaces, types,
   and strict return types for all functions, server actions, and components.
2. **Architecture & Folder Structure:** Adhere strictly to a feature-based
   folder architecture (colocating components, hooks, schemas, and actions
   within feature domains). Keep components small, modular, and
   single-responsibility.
3. **Performance & DRY Principles:** Leverage Next.js App Router performance
   optimizations (parallel routes, streaming, selective server-side rendering,
   caching strategies). Build clean reusable higher-order functions (HOFs) and
   wrappers.
4. **Data Handling & Validation:** Always use Zod schemas for runtime validation
   on both client (via React Hook Form) and server (within Server Actions).
5. **State Management:** Isolate client UI states using Redux Toolkit where
   global client synchronization is needed, while maximizing Next.js Server
   Actions and server components for data mutations and fetching.
6. **No Placeholder Code:** Write complete, functioning implementations. Never
   use ellipses (`// ... code here`) or shortcut placeholders.
7. **Git Commit:** For new features or some changes, commit the changes to the
   development branch.
8. **Terminal:** use pnpm.

## Project Stack (as implemented)

- **Framework:** Next.js 16.4.0 (App Router, Turbopack)
- **React:** 19.3.0
- **Styling:** Tailwind CSS v4 (`src/app/globals.css`), shadcn/ui (style:
  `base-mira`), lucide-react icons
- **Forms:** React Hook Form v7 + @hookform/resolvers/zod + Zod v4
- **Database:** MongoDB + Mongoose v9 (cached connection on
  `globalThis.mongooseCache`)
- **Authentication:** Better Auth (emailAndPassword provider,
  `@better-auth/mongo-adapter`, 30-day sessions, `better-auth/client` on the
  client)
- **PDF:** @react-pdf/renderer
- **State:** Redux Toolkit (client UI state only)
- **Theme:** next-themes (light/dark/system)
- **Package Manager:** pnpm 12.14.0

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Source-of-truth folder structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx              # Root layout (Providers + StoreProvider, fonts, metadata)
│   ├── page.tsx                # Landing page
│   ├── auth/
│   │   ├── login/page.tsx      # Sign-in (better-auth client, signIn.email)
│   │   └── register/page.tsx   # Sign-up (better-auth client, signUp.email)
│   ├── api/
│   │   └── auth/[...all]/route.ts  # Better Auth Next.js handler (toNextJsHandler)
│   └── invoices/
│       ├── page.tsx            # Invoice listing (search, status filter, sort, pagination; auth required)
│       └── new/page.tsx        # Invoice generator (optional auth; guest preview allowed)
├── components/
│   ├── providers.tsx           # BetterAuth AuthProvider + SessionProvider wrapper
│   ├── layout/
│   │   ├── app-sidebar.tsx     # Responsive navigation sidebar
│   │   ├── mobile-nav.tsx      # Mobile top navigation
│   │   └── page-header.tsx     # Breadcrumb + page title
│   ├── shared/
│   │   ├── container.tsx
│   │   ├── confirm-dialog.tsx  # Reusable confirmation dialog
│   │   ├── empty-state.tsx     # Empty state placeholder
│   │   ├── error-state.tsx     # Error state placeholder
│   │   └── loading-state.tsx   # Loading state placeholder
│   └── ui/                     # shadcn/ui components (button, input, select, etc.)
├── features/
│   └── invoices/
│       ├── actions/
│       │   ├── create-invoice.ts   # createInvoiceAction + getNextPiNumber (optional auth)
│       │   ├── update-invoice.ts   # updateInvoiceAction (ownership: _id + ownerId)
│       │   ├── delete-invoice.ts   # deleteInvoiceAction (ownership: _id + ownerId)
│       │   └── list-invoices.ts    # listInvoicesAction (paginated, auth required)
│       ├── components/
│       │   ├── invoice-form.tsx        # Multi-section invoice form (RHF + Zod)
│       │   ├── invoice-generator.tsx   # Page-level form orchestration + save/export
│       │   ├── invoice-line-items.tsx  # Line-item CRUD with combobox description
│       │   ├── line-item-card.tsx      # Mobile stacked line-item card
│       │   ├── invoice-preview.tsx     # Read-only A4 live preview
│       │   ├── invoice-summary.tsx     # Subtotal/total summary
│       │   ├── invoice-toolbar.tsx     # Save/export/preview toolbar
│       │   └── invoice-pdf.tsx         # @react-pdf/renderer A4 document
│       ├── schemas/
│       │   └── invoice.schema.ts       # Shared Zod schemas (client + server)
│       ├── store/
│       │   └── invoice-ui.slice.ts     # Redux UI slice (preview, dirty, zoom, etc.)
│       ├── types.ts                # Invoice line-item view type
│       ├── utils/
│       │   ├── calculate-invoice-total.ts   # Decimal-safe money math
│       │   ├── format-invoice-number.ts     # MMF/###/YY numbering
│       │   ├── number-to-words.ts           # "Say total" verbal amount
│       │   ├── products.ts                  # Searchable description options
│       │   └── __tests__/                   # Unit tests for calc utils
├── lib/
│   ├── auth.ts                 # Better Auth instance (mongodbAdapter, cached MongoClient)
│   ├── auth/
│   │   ├── get-current-user.ts   # Session-based user resolution (server)
│   │   └── require-user.ts       # Requires authenticated user (server)
│   ├── cache/
│   │   ├── cache-tags.ts         # user:${userId}:invoices / user:${userId}:invoice:${invoiceId}
│   │   └── cache-policy.ts       # Revalidation policy constants
│   ├── db/
│   │   ├── mongoose.ts           # Cached Mongoose connection (globalThis)
│   │   ├── model-helpers.ts      # Safe model registration (no OverwriteModelError)
│   │   └── models/
│   │       ├── index.ts            # Model barrel exports
│   │       ├── user.model.ts       # User (better-auth User + companyProfile)
│   │       ├── invoice.model.ts    # Invoice (ownerId relation, embedded line items)
│   │       ├── account.model.ts    # better-auth Account collection
│   │       └── session.model.ts    # better-auth Session collection
│   ├── validations/
│   │   └── action-result.ts        # Typed ActionResult + ZodError serializer
│   └── utils.ts                    # cn() utility
├── hooks/
│   ├── use-media-query.ts          # Client media query hook
│   └── use-unsaved-changes.ts      # beforeunload unsaved-changes guard
├── store/
│   ├── index.ts                    # Redux Toolkit store (invoiceUi slice only)
│   └── provider.tsx                # Redux Provider client component
└── types/
    ├── common.ts                   # Currency, InvoiceStatus, ZoomLevel types
    └── database.ts                 # Document type re-exports
```

## Authentication

- **Provider:** Better Auth (`emailAndPassword`, `@better-auth/mongo-adapter`)
- **Password hashing:** handled by Better Auth (bcrypt under the hood)
- **Session strategy:** Better Auth sessions (30 days), resolved via
  `auth.api.getSession()`
- **Route:** `GET/POST/PUT/PATCH/DELETE /api/auth/[...all]`
- **Guest flow:** Unauthenticated users can preview/generate invoices
  client-side; persistence to MongoDB requires sign-in

## Server Actions

All invoice mutations go through Next.js Server Actions:

| Action                | File                                          | Auth                     | Ownership                               |
| --------------------- | --------------------------------------------- | ------------------------ | --------------------------------------- |
| `createInvoiceAction` | `features/invoices/actions/create-invoice.ts` | Optional (guest allowed) | Derived from session when authenticated |
| `updateInvoiceAction` | `features/invoices/actions/update-invoice.ts` | Required                 | Query by `_id` + `ownerId`              |
| `deleteInvoiceAction` | `features/invoices/actions/delete-invoice.ts` | Required                 | Query by `_id` + `ownerId`              |
| `listInvoicesAction`  | `features/invoices/actions/list-invoices.ts`  | Required                 | Filter by `ownerId`                     |

**Security rules enforced:**

- `ownerId` is always derived from the authenticated session, never from client
  input
- `totalAmount` and `subtotal` are recalculated server-side; client values are
  ignored
- Update/delete queries always filter by `_id` and `ownerId` together
- Non-ownership returns a generic "not found" result (no information leakage)
- Zod validation runs on both client (React Hook Form) and server (Server
  Action)

## Caching Strategy

- Mongoose connection is cached on `globalThis.mongooseCache` to prevent
  unbounded connections during dev hot reload and serverless reuse
- Connection is established lazily inside Server Actions/loaders, never at
  module import
- Cache tags follow `user:${userId}:invoices` and
  `user:${userId}:invoice:${invoiceId}` convention
- `revalidatePath` is called after mutations for `/invoices` and detail paths

## Verification Order

```bash
pnpm lint          # ESLint
pnpm exec tsc --noEmit  # TypeScript strict typecheck
pnpm build         # Next.js production build
```