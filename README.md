# Proforma Invoice Generator

A premium, responsive B2B proforma invoice generator for **M.M FABRICS** built with Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui, Mongoose, and NextAuth v4.

## Tech Stack

- **Framework:** Next.js 16.4 (App Router, Turbopack)
- **React:** 19.3
- **Styling:** Tailwind CSS v4, shadcn/ui (base-mira), Base UI primitives
- **Forms:** React Hook Form v7 + @hookform/resolvers/zod + Zod v4
- **Database:** MongoDB + Mongoose v9 (cached connection)
- **Authentication:** NextAuth v4 (Credentials provider, bcryptjs, JWT sessions)
- **State:** Redux Toolkit (client UI state only)
- **PDF:** @react-pdf/renderer
- **File Upload:** Next Cloudinary, multer
- **Theme:** next-themes (light/dark/system)
- **Package Manager:** pnpm 12.14.0

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Sign-in page (credentials)
│   │   └── register/page.tsx       # Sign-up page (password hashed with bcrypt)
│   ├── api/
│   │   └── auth/[...all]/route.ts  # NextAuth v4 handlers
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected dashboard layout (Redux + Sidebar)
│   │   └── invoices/
│   │       └── new/page.tsx        # Invoice generator (split form + preview)
│   ├── layout.tsx                  # Root layout (SessionProvider, fonts, metadata)
│   └── page.tsx                    # Landing page
├── components/
│   ├── providers.tsx               # NextAuth SessionProvider wrapper
│   ├── layout/
│   │   ├── app-sidebar.tsx         # Responsive navigation sidebar
│   │   ├── mobile-nav.tsx          # Mobile top navigation
│   │   └── page-header.tsx         # Breadcrumb + page title
│   ├── shared/
│   │   ├── confirm-dialog.tsx      # Reusable confirmation dialog
│   │   ├── empty-state.tsx         # Empty state placeholder
│   │   ├── error-state.tsx         # Error state placeholder
│   │   └── loading-state.tsx       # Loading state placeholder
│   └── ui/                         # shadcn/ui components (button, input, select, etc.)
├── features/
│   ├── auth/
│   │   └── actions/
│   │       └register.ts            # Register server action (bcrypt hash + User create)
│   └── invoices/
│       ├── actions/
│       │   ├── create-invoice.ts   # Create invoice server action (guest + auth)
│       │   ├── update-invoice.ts   # Update invoice server action (ownership enforced)
│       │   └── delete-invoice.ts   # Delete invoice server action (ownership enforced)
│       ├── components/
│       │   ├── invoice-form.tsx    # Multi-section invoice form (RHF + Zod)
│       │   ├── invoice-generator.tsx # Page-level form orchestration + save/export
│       │   ├── invoice-line-items.tsx # Line-item CRUD with combobox description
│       │   ├── invoice-line-item.tsx # Mobile stacked line-item card
│       │   ├── invoice-preview.tsx   # Read-only A4 live preview
│       │   ├── invoice-summary.tsx   # Subtotal/total summary
│       │   └── invoice-toolbar.tsx   # Save/export/preview toolbar
│       ├── schemas/
│       │   └── invoice.schema.ts   # Shared Zod schemas (client + server)
│       ├── store/
│       │   └── invoice-ui.slice.ts # Redux UI slice (preview, dirty, zoom, etc.)
│       ├── types.ts                # Invoice line-item view type
│       └── utils/
│           ├── calculate-invoice-total.ts   # Decimal-safe money math
│           ├── format-invoice-number.ts     # PI-YYYYMMDD-### numbering
│           ├── number-to-words.ts           # "Say total" verbal amount
│           ├── products.ts                  # Searchable description options
│           └── __tests__/                   # Unit tests for calc utils
├── lib/
│   ├── auth.ts                     # NextAuth v4 config (credentials + JWT)
│   ├── auth/
│   │   ├── get-current-user.ts     # Session-based user resolution (server)
│   │   └── require-user.ts         # Requires authenticated user (server)
│   ├── cache/
│   │   ├── cache-tags.ts           # User-scoped cache tag helpers
│   │   └── cache-policy.ts         # Revalidation policy constants
│   ├── db/
│   │   ├── mongoose.ts             # Cached Mongoose connection (globalThis)
│   │   ├── model-helpers.ts        # Safe model registration (no OverwriteModelError)
│   │   └── models/
│   │       ├── index.ts            # Model barrel exports
│   │       ├── user.model.ts       # User (NextAuth + companyProfile)
│   │       ├── invoice.model.ts    # Invoice (ownerId relation, embedded line items)
│   │       ├── account.model.ts    # NextAuth Account collection
│   │       └── session.model.ts    # NextAuth Session collection
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
    ├── database.ts                 # Document type re-exports
    └── next-auth.d.ts              # NextAuth type augmentation (role on User/JWT/Session)
```

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Configure `.env`:

```env
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>"
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

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm exec tsc --noEmit` | TypeScript typecheck |

## Authentication

- **Provider:** NextAuth v4 Credentials provider
- **Password hashing:** bcryptjs (12 salt rounds)
- **Session strategy:** JWT (self-contained signed cookie)
- **Session user fields:** `id`, `email`, `name`, `role`
- **Route:** `POST /api/auth/[...all]`
- **Guest flow:** Unauthenticated users can preview/generate invoices client-side; persistence to MongoDB requires sign-in

## Database Models

### User
- `name`, `email` (unique, indexed), `passwordHash` (never selected by default), `role` (`admin` \| `member`)
- `companyProfile` (companyName, address, corporateOffice, contactNumber, email, logoUrl)
- `createdAt`, `updatedAt`

### Invoice (belongs to User via `ownerId`)
- `ownerId` (ObjectId ref User, required, indexed)
- `invoiceNumber`, `issueDate`, `currency` (default `USD`)
- `status` (`draft` \| `ready` \| `exported` \| `archived`, indexed)
- `seller`, `buyer` (embedded contact info)
- `lineItems[]` (description, style, color, quantity, unitPrice, totalAmount, unit)
- `subtotal`, `totalAmount` (calculated server-side)
- `notes` (sayTotal, goodsDeliveryDestination, goodsOrigin, advisingBank, allowance, packing, shipmentDate, payment, partialShipment, piValidity)
- `termsAndConditions[]`, `signatures` (buyerLabel, sellerLabel, stampUrl, include flags)
- Indexes: `{ownerId, updatedAt}`, `{ownerId, status, updatedAt}`, `{ownerId, invoiceNumber}`

## Server Actions

All invoice mutations go through Next.js Server Actions:

| Action | File | Auth | Ownership |
|--------|------|------|-----------|
| `createInvoiceAction` | `features/invoices/actions/create-invoice.ts` | Optional (guest allowed) | Derived from session when authenticated |
| `updateInvoiceAction` | `features/invoices/actions/update-invoice.ts` | Required | Query by `_id` + `ownerId` |
| `deleteInvoiceAction` | `features/invoices/actions/delete-invoice.ts` | Required | Query by `_id` + `ownerId` |
| `registerUserAction` | `features/auth/actions/register.ts` | None | N/A |

**Security rules enforced:**
- `ownerId` is always derived from the authenticated session, never from client input
- `totalAmount` and `subtotal` are recalculated server-side; client values are ignored
- Update/delete queries always filter by `_id` and `ownerId` together
- Non-ownership returns a generic "not found" result (no information leakage)
- Zod validation runs on both client (React Hook Form) and server (Server Action)

## Caching Strategy

- Mongoose connection is cached on `globalThis.mongooseCache` to prevent unbounded connections during dev hot reload and serverless reuse
- Connection is established lazily inside Server Actions/loaders, never at module import
- Cache tags follow `user:${userId}:invoices` and `user:${userId}:invoice:${invoiceId}` convention
- `revalidatePath` is called after mutations for `/dashboard/invoices` and detail paths

## Features

- User authentication (login/register with NextAuth v4 + bcrypt)
- Dashboard with protected layout and responsive sidebar
- Invoice generator with live A4 preview
- Multi-line-item support with searchable description combobox
- Decimal-safe money calculations (integer-cent arithmetic)
- "Say total" verbal amount rendering
- Draft saving with Server Actions
- Save/saved/error states with toast notifications
- Unsaved-changes navigation guard (`beforeunload`)
- Responsive design: desktop sidebar + sticky preview, tablet collapsible sidebar, mobile stacked cards
- PDF export preparation (via @react-pdf/renderer)
- Cloudinary integration for avatar/logo uploads
- Light/dark/system theme support (next-themes)

## Verification Order

```bash
pnpm lint          # ESLint
pnpm exec tsc --noEmit  # TypeScript strict typecheck
pnpm build         # Next.js production build
```
