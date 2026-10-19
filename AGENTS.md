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
9. **Documentation and commits:** After completing a feature or code change,
   commit the changes and update the relevant Markdown files (`README.md`,
   `AGENTS.md`, and `FOLDER_STRUCTURE.md`) when behavior, conventions, or the
   source tree changes.

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
- **PDF:** PDFKit (server-side generation) + JSX live preview
- **State:** Redux Toolkit (client UI state only)
- **Theme:** next-themes (light/dark/system)
- **Package Manager:** pnpm 12.14.0

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` (resolved from this file's directory; in
monorepos the `next` package may not be visible from the repo root) before
writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at
`node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a
diff only re-creates the uncommitted change; committing it with your work keeps
the tree clean.

<!-- END:nextjs-agent-rules -->

## Source-of-truth folder structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for the complete directory tree
and per-file descriptions. AGENTS.md and README.md reference this file to avoid
duplication (DRY).

## Authentication

- **Provider:** Better Auth (`emailAndPassword`, `@better-auth/mongo-adapter`)
- **Password hashing:** handled by Better Auth (bcrypt under the hood)
- **Session strategy:** Better Auth sessions (30 days), resolved via
  `auth.api.getSession({ headers: await headers() })`; server helpers must
  forward the incoming request headers so Better Auth can read the session
  cookie
- **Route:** `GET/POST/PUT/PATCH/DELETE /api/auth/[...all]`
- **Guest flow:** Unauthenticated users can preview/generate invoices
  client-side; persistence to MongoDB requires sign-in
- **Route redirects:** `src/proxy.ts` performs optimistic Better Auth cookie
  checks for the protected invoice list and redirects signed-in users away from
  login and registration. Server pages/actions remain responsible for
  authoritative session and ownership checks. The guest-accessible invoice
  studio (`/invoices/new`) is not blocked by the proxy.

## Server Actions

All invoice mutations go through Next.js Server Actions:

| Action                   | File                                              | Auth                     | Ownership                                 |
| ------------------------ | ------------------------------------------------- | ------------------------ | ----------------------------------------- |
| `createInvoiceAction`    | `features/invoices/actions/create-invoice.ts`     | Optional (guest allowed) | Derived from session when authenticated   |
| `updateInvoiceAction`    | `features/invoices/actions/update-invoice.ts`     | Required                 | Query by `_id` + `ownerId`                |
| `deleteInvoiceAction`    | `features/invoices/actions/delete-invoice.ts`     | Required                 | Query by `_id` + `ownerId`                |
| `listInvoicesAction`     | `features/invoices/actions/list-invoices.ts`      | Required                 | Filter by `ownerId`                       |
| `exportInvoicePdfAction` | `features/invoices/actions/export-invoice-pdf.ts` | Optional (guest allowed) | Owner derived from session when persisted |

**Security rules enforced:**

- `ownerId` is always derived from the authenticated session, never from client
  input
- `totalAmount` and `subtotal` are recalculated server-side; client values are
  ignored
- Buyer, invoice notes, line totals, subtotal, total quantity, and status are
  validated and persisted together for authenticated invoices
- Update/delete queries always filter by `_id` and `ownerId` together
- When exporting a saved invoice, pass its id through the existing export action
  so persistence updates that owner-scoped record rather than creating a new
  invoice
- Non-ownership returns a generic "not found" result (no information leakage)
- Zod validation runs on both client (React Hook Form) and server (Server
  Action)

## PDF generation and live preview

- Live preview is a JSX/HTML A4 document (`invoice-preview.tsx`) that updates
  from React Hook Form `useWatch`. It is not a PDF renderer.
- PDF files are generated server-side with PDFKit
  (`features/invoices/pdf/generate-invoice-pdf.ts`) and downloaded from
  `exportInvoicePdfAction`. Guests can export without persisting; authenticated
  exports are persisted with `exported` status.
- The invoice workspace validates the full payload with Zod, presents database
  records in an owner-scoped table, supports preview and PDF export, and
  requires confirmation before deletion.
- Goods delivery/banking/shipping notes and terms use application defaults in
  the invoice payload; keep these static details out of the user-facing form
  until editable terms are requested. The initial product row uses editable
  values from the supplied invoice sample; calculate all totals from quantity
  and unit price rather than trusting the client-provided total.
- Currency values in the invoice preview, list, and PDF use the `en-US` number
  format; invoice-list quantities use `en-ES`. The seller seal asset is served
  from `public/mm-fabrics-seal.png`.
- Preview and PDF share the same mapped document model via
  `buildInvoiceDocument()`.
- `pdfkit` is listed in `serverExternalPackages` so Next.js does not bundle it
  into the server graph.

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
