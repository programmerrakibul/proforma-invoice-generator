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
   wrappers. Break large components into small reusable components.
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
10. **Code Formatting** After completing the changes format the code files using
    prettier.
11. **Testing and Code Review** After completing a feature whether it's small or
    big, test it in dev and build version and review the code using
    `coderabbitai` (if `coderaabbitai` is not available use code review skill).
    Also use ESLint for unused imports or others.

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

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

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
- **Invoice flow:** Invoice creation and PDF export require an authenticated session; no guest invoice generation is allowed
- **Route redirects:** `src/proxy.ts` protects `/dashboard/*`; the dashboard layout and server actions enforce authoritative session checks and ownership.

## Dashboard and customer management

- `/dashboard` redirects to `/dashboard/invoices`; invoice and customer pages live under `src/app/dashboard` and share an authenticated dashboard layout.
- Customer records are owner-scoped and validated with `createCustomerSchema`; customer and invoice queries use mongoose-paginate-v2. Both lists share query utilities, filter/sort controls, and a responsive table with pagination.
- Invoice creation requires a saved customer ID. The server verifies that customer belongs to the session owner, persists its reference, and snapshots its name and address for invoice preview/PDF stability.

## Server Actions

All invoice mutations go through Next.js Server Actions:

| Action                   | File                                              | Auth     | Ownership                               |
| ------------------------ | ------------------------------------------------- | -------- | --------------------------------------- |
| `createInvoiceAction`    | `features/invoices/actions/create-invoice.ts`     | Required | Derived from session when authenticated |
| `updateInvoiceAction`    | `features/invoices/actions/update-invoice.ts`     | Required | Query by `_id` + `ownerId`              |
| `deleteInvoiceAction`    | `features/invoices/actions/delete-invoice.ts`     | Required | Query by `_id` + `ownerId`              |
| `listInvoicesAction`     | `features/invoices/actions/list-invoices.ts`      | Required | Filter by `ownerId`                     |
| `exportInvoicePdfAction` | `features/invoices/actions/export-invoice-pdf.ts` | Required | Session owner                           |

- `listInvoicesAction` validates page, page size, search, status, and sort with
  Zod, then applies owner-scoped search/filter/sort and pagination in MongoDB.
  The `/dashboard/invoices` page debounces search input, reads URL search parameters on
  the server, and renders only the requested page of results.

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

- Live preview is a single-page JSX/HTML A4 document (`invoice-preview.tsx`)
  with a compact 12 mm page inset that updates from React Hook Form `useWatch`.
  It uses the shadcn table and separator, the company logo, paired shipment/banking and
  terms columns, and a signature and thank-you footer.
- Seller address, corporate office, contact number, and email are shown as four
  stacked rows in the HTML preview and generated PDF.
- PDF files are generated server-side with PDFKit
  (`features/invoices/pdf/generate-invoice-pdf.ts`) and downloaded from
  `exportInvoicePdfAction`. Exports require authentication and are persisted with `exported` status.
- The invoice workspace validates the full payload with Zod, presents database
  records in an owner-scoped table, supports preview and PDF export, and
  requires confirmation before deletion.
- Line items store fabric, construction, and a numeric width string from 40 to
  80 inches. The fabric field offers searchable catalog suggestions and an
  explicit custom-value action; color offers common textile color suggestions
  and custom entry, construction remains a text input, and width is selected
  from a 40–80 dropdown. Preview and PDF compose fabric, construction, and
  width into a three-line goods description.
- Goods delivery/banking/shipping notes and terms use shared application
  defaults from `src/data/` and remain editable in the invoice form. Users can
  edit shipment/banking labels and values; the selected customer name is always
  used for the delivery destination. Currency is limited to USD and BDT, and
  currency changes refresh the advising-bank and payment defaults from
  `src/data/bank-accounts.ts`. BDT invoices omit terms in the form, preview, PDF,
  and database. Delivery date is optional and must persist through invoice
  updates, preview, and PDF export.
- New PI numbers are generated server-side as `MMF-ddmmyy-random4digits`.
  Collision checks and a partial unique MongoDB index enforce global
  uniqueness for generated numbers while preserving legacy invoice numbers.
  The initial product row uses editable values from the supplied invoice sample;
  calculate all totals from quantity and unit price rather than trusting the
  client-provided total.
- Currency values in the invoice preview, list, and PDF use the `en-US` number
  format; invoice-list quantities use `en-ES`. The seller seal asset is served
  from `public/mm-fabrics-seal.png`.
- Preview and PDF share the same mapped document model via
  `buildInvoiceDocument()`. Both follow the supplied A4 design, use the company
  logo and seal, and place the compact signature and thank-you footer directly
  after the shipment details and terms. PDF layout measures against the A4 page
  bottom margin so the terms and signature area use available page space. The
  table includes actual line items and totals without artificial blank rows.
- `pdfkit` is listed in `serverExternalPackages` so Next.js does not bundle it
  into the server graph.

## Shared site header

- `src/components/layout/site-header.tsx` keeps the session-aware desktop
  navigation and account action in the shared header.
- `src/components/layout/mobile-navigation.tsx` provides the accessible drawer
  menu below the desktop navigation breakpoint; authenticated invoice links
  remain hidden from guests.
- `src/features/auth/components/logout-button.tsx` provides the Better Auth
  sign-out action in the desktop account controls and authenticated mobile menu.

## Caching Strategy

- Mongoose connection is cached on `globalThis.mongooseCache` to prevent
  unbounded connections during dev hot reload and serverless reuse
- Connection is established lazily inside Server Actions/loaders, never at
  module import
- Cache tags follow `user:${userId}:invoices` and
  `user:${userId}:invoice:${invoiceId}` convention
- `revalidatePath` is called after mutations for `/dashboard/invoices` and detail paths

## Verification Order

```bash
pnpm lint          # ESLint
pnpm exec tsc --noEmit  # TypeScript strict typecheck
pnpm build         # Next.js production build
```
