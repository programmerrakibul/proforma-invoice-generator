# Proforma Invoice Generator

A premium, responsive B2B proforma invoice generator for **M.M FABRICS** built
with Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui, Mongoose, and
Better Auth.

The shared site header adapts from a compact mobile drawer to centered desktop
navigation, keeps invoice links scoped to authenticated users, and provides
sign-out controls on both mobile and desktop.

## Tech Stack

- **Framework:** Next.js 16.4.0 (App Router, Turbopack)
- **React:** 19.3
- **Styling:** Tailwind CSS v4, shadcn/ui (base-mira), lucide-react icons
- **Forms:** React Hook Form v7 + @hookform/resolvers/zod + Zod v4
- **Database:** MongoDB + Mongoose v9 (cached connection)
- **Authentication:** Better Auth (emailAndPassword provider,
  `@better-auth/mongo-adapter`, 30-day sessions)
- **State:** Redux Toolkit (client UI state only)
- **PDF:** PDFKit (server-side generation) + JSX live preview
- **Theme:** next-themes (light/dark/system)
- **Package Manager:** pnpm 12.14.0

## Project Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for the complete directory tree
and per-file descriptions. AGENTS.md and README.md reference this file to avoid
duplication (DRY).

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Configure `.env`:

```env
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>"
BETTER_AUTH_URL=http://localhost:3000
AUTH_SECRET="<random-32-byte-base64-string>"
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

3. Install dependencies:

```bash
pnpm install
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script                   | Description                  |
| ------------------------ | ---------------------------- |
| `pnpm dev`               | Start dev server (Turbopack) |
| `pnpm build`             | Production build             |
| `pnpm start`             | Start production server      |
| `pnpm lint`              | Run ESLint                   |
| `pnpm exec tsc --noEmit` | TypeScript typecheck         |

## Authentication

- **Provider:** Better Auth (`emailAndPassword`)
- **Password hashing:** handled by Better Auth (bcrypt under the hood)
- **Session strategy:** Better Auth sessions (30 days)
- **Session user fields:** `id`, `email`, `name`
- **Route:** `/api/auth/[...all]`
- **Client SDK:** `better-auth/client` (`signUp.email`, `signIn.email`)
- **Server helpers:** `getCurrentUser()` (optional), `requireUser()` (throws
  when unauthenticated)
- **Route redirects:** `src/proxy.ts` performs optimistic session-cookie checks
  for the protected invoice list and redirects signed-in users away from login
  and registration; the invoice page still verifies the Better Auth session
  server-side
- **Server session lookup:** Both helpers forward `await headers()` to
  `auth.api.getSession()` so Better Auth can read the incoming session cookie
- **Redirect behavior:** Login and registration accept a validated same-site
  `redirect` query value and fall back to `/invoices`
- **Guest flow:** Unauthenticated users can preview/generate invoices
  client-side; persistence to MongoDB requires sign-in

## Database Models

### User (Better Auth + custom profile)

- Better Auth `user`, `account`, `session` collections
- Custom `User` model adds `companyProfile` (companyName, address,
  corporateOffice, contactNumber, email, logoUrl)
- `createdAt`, `updatedAt`

### Invoice (belongs to User via `ownerId`)

- `ownerId` (ObjectId ref User, required, indexed)
- `piNumber` (`MMF/###/YY` format, e.g. `MMF/001/26`)
- `issueDate`, `currency` (default `USD`)
- `status` (`draft` \| `ready` \| `exported` \| `archived`, indexed)
- `seller`, `buyer` (embedded contact info, including consignee address and
  destination country)
- `lineItems[]` (description, style, color, quantity, unitPrice, totalAmount,
  unit)
- `subtotal`, `totalAmount`, `totalQuantity` (calculated server-side)
- `notes` (sayTotal, goodsDeliveryDestination, goodsOrigin, advisingBank,
  allowance, packing, shipmentDate, payment, partialShipment, piValidity)
- `termsAndConditions[]`, `signatures` (buyerLabel, sellerLabel, stampUrl,
  include flags)
- Indexes: `{ownerId, updatedAt}`, `{ownerId, status, updatedAt}`,
  `{ownerId, piNumber}`

## Server Actions

All invoice mutations go through Next.js Server Actions:

| Action                   | File                                              | Auth                     | Ownership                               |
| ------------------------ | ------------------------------------------------- | ------------------------ | --------------------------------------- |
| `createInvoiceAction`    | `features/invoices/actions/create-invoice.ts`     | Optional (guest allowed) | Derived from session when authenticated |
| `updateInvoiceAction`    | `features/invoices/actions/update-invoice.ts`     | Required                 | Query by `_id` + `ownerId`              |
| `deleteInvoiceAction`    | `features/invoices/actions/delete-invoice.ts`     | Required                 | Query by `_id` + `ownerId`              |
| `listInvoicesAction`     | `features/invoices/actions/list-invoices.ts`      | Required                 | Filter by `ownerId`                     |
| `exportInvoicePdfAction` | `features/invoices/actions/export-invoice-pdf.ts` | Optional (guest allowed) | Session owner when persisted            |

**Security rules enforced:**

- `ownerId` is always derived from the authenticated session, never from client
  input
- `totalAmount` and `subtotal` are recalculated server-side; client values are
  ignored
- Update/delete queries always filter by `_id` and `ownerId` together
- Exporting an invoice from the list updates that existing record to `exported`
  only when both its id and the authenticated owner match
- Non-ownership returns a generic "not found" result (no information leakage)
- Zod validation runs on both client (React Hook Form) and server (Server
  Action)

## PDF generation and live preview

- Live preview is a single-page JSX/HTML A4 document with 1-inch margins that follows the M.M FABRICS invoice design and updates as the form changes
- PDF files are generated on the server with PDFKit and downloaded via
  `exportInvoicePdfAction` (guests can export without signing in)
- Preview and PDF share the same mapped document model and matching A4 layout, company logo, seal, and final-page signature/footer

## Caching Strategy

- Mongoose connection is cached on `globalThis.mongooseCache` to prevent
  unbounded connections during dev hot reload and serverless reuse
- Connection is established lazily inside Server Actions/loaders, never at
  module import
- Cache tags follow `user:${userId}:invoices` and
  `user:${userId}:invoice:${invoiceId}` convention
- `revalidatePath` is called after mutations for `/invoices` and detail paths

## Features

- User authentication (sign-in/sign-up with Better Auth email/password)
- Premium responsive landing, authentication, and invoice studio interfaces
- Shared site header on every page with centered navigation and a session-aware
  login/user placeholder; auth screens include back navigation and support a
  safe same-site `redirect` query parameter
- Auth success feedback with toast notifications and destination navigation
- Landing page and protected invoice table with search, status filter, sorting,
  pagination, preview, and confirmed deletion
- Invoice list rows can export saved invoices to PDF and mark them exported
- Invoice generator with live A4 JSX preview matching the M.M FABRICS invoice design (HTML, updates as the form changes)
- Multi-line-item support with required-field validation and guarded add-item
  flow
- Buyer/consignee details and invoice line items; delivery, banking, shipment,
  payment notes, and terms are populated from application defaults in the
  background rather than exposed as form fields
- The first line item starts with the editable fabric, style, color, quantity,
  and unit-price values from the invoice sample; calculated totals are always
  recomputed from quantity and unit price
- Decimal-safe money calculations (integer-cent arithmetic)
- "Say total" verbal amount rendering
- Draft saving with Server Actions
- Save/saved/error states with toast notifications
- Unsaved-changes navigation guard (`beforeunload`)
- Responsive design: desktop sidebar + sticky preview, tablet collapsible
  sidebar, mobile stacked cards
- PDF export (PDFKit, generated on the server; authenticated exports are saved)
- Invoice totals show aggregate quantity, unit-price total, and total amount
- Locale-aware `en-US` currency formatting, `en-ES` quantity formatting, and M.M
  FABRICS seal/signature footer
- Light/dark/system theme support (next-themes)

## Verification Order

```bash
pnpm lint          # ESLint
pnpm exec tsc --noEmit  # TypeScript strict typecheck
pnpm build         # Next.js production build
```
