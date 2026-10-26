# Folder Structure

Source-of-truth layout for the Proforma Invoice Generator (M.M FABRICS).
Referenced by AGENTS.md and README.md.

```plaintext
src/
├── proxy.ts                    # Auth redirects for protected dashboard and auth pages
├── app/
│   ├── globals.css
│   ├── loading.tsx              # Global branded loading fallback
│   ├── layout.tsx              # Root layout (session-aware shared header, providers, fonts, metadata)
│   ├── page.tsx                # Landing page
│   ├── auth/
│   │   ├── loading.tsx         # Shared loading UI for sign-in and registration
│   │   ├── login/page.tsx      # Sign-in page (Better Auth email/password; server-resolved redirect)
│   │   └── register/page.tsx   # Sign-up page (Better Auth email/password; server-resolved redirect)
│   ├── api/
│   │   └── auth/[...all]/route.ts  # Better Auth Next.js handler (toNextJsHandler)
│   └── dashboard/  # Protected dashboard base path
│       ├── page.tsx          # Redirects to invoice workspace
│       ├── layout.tsx        # Authenticated dashboard shell
│       ├── invoices/
│       │   ├── page.tsx      # Invoice list with shared filtering and pagination
│       │   └── new/page.tsx  # Customer-backed invoice studio
│       └── customers/
│           ├── page.tsx      # Customer list with shared filtering and pagination
│           └── new/page.tsx  # Customer create page
├── assets/
│   ├── logo.png                 # M.M FABRICS logo used by the invoice preview and PDF
│   └── mm_fabrics_seal.png      # Original seller seal asset
├── components/
│   ├── providers.tsx           # Global Sonner toast provider
│   ├── layout/
│   │   ├── app-sidebar.tsx     # Responsive navigation sidebar
│   │   ├── dashboard-shell.tsx # Responsive shell with tablet sidebar spacing
│   │   ├── mobile-nav.tsx      # Mobile top navigation
│   │   ├── page-header.tsx     # Breadcrumb + page title
│   │   ├── mobile-navigation.tsx # Accessible responsive drawer navigation
│   │   └── site-header.tsx     # Shared responsive session-aware navigation and account action
│   ├── shared/
│   │   ├── container.tsx
│   │   ├── list-toolbar.tsx    # Reusable search, filter, and sort form
│   │   ├── responsive-data-table.tsx # Responsive table/cards with pagination
│   │   ├── confirm-dialog.tsx  # Reusable confirmation dialog
│   │   ├── empty-state.tsx     # Empty state placeholder
│   │   ├── error-state.tsx     # Error state placeholder
│   │   └── loading-state.tsx   # Loading state placeholder
│   └── ui/                     # shadcn/ui components (button, input, select, etc.)
│       └── password-input.tsx  # Reusable password input with show/hide control
├── data/
│   ├── buyer.ts                # Default buyer / consignee details
│   ├── company.ts              # M.M FABRICS seller profile
│   ├── fabrics.ts              # Fabric and construction preset catalog
│   └── invoice-static.ts       # Default invoice notes and terms
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── auth-field.tsx      # Shared labeled auth input and error state
│   │   │   ├── auth-page.tsx       # Shared premium auth page frame with back navigation
│   │   │   ├── login-form.tsx      # Validated Better Auth sign-in flow
│   │   │   ├── logout-button.tsx   # Better Auth sign-out action
│   │   │   └── register-form.tsx   # Validated Better Auth registration flow
│   │   ├── schemas/
│   │   │   └── auth.schema.ts      # Shared Zod schemas and auth form types
│   │   └── utils/
│   │       └── auth-redirect.ts    # Same-site auth redirect validation
│   ├── customers/
│   │   ├── actions/customer-actions.ts # Owner-scoped create/list/selector data; paginate v2
│   │   ├── components/customer-form.tsx # Zod-validated customer form
│   │   └── schemas/customer.schema.ts  # Customer validation schema
│   └── invoices/
│       ├── actions/
│       │   ├── create-invoice.ts       # createInvoiceAction + getNextPiNumber (auth required)
│       │   ├── update-invoice.ts       # updateInvoiceAction (ownership: _id + ownerId)
│       │   ├── delete-invoice.ts       # deleteInvoiceAction (ownership: _id + ownerId)
│       │   ├── list-invoices.ts        # listInvoicesAction (Zod-validated server search/filter/sort/pagination, auth required)
│       │   └── export-invoice-pdf.ts   # Export PDF; authenticated and persisted as exported
│       ├── components/
│       │   ├── list-toolbar.tsx # Reusable search/filter/sort form
│       │   ├── invoice-form.tsx        # PI metadata and buyer form (RHF + Zod)
│       │   ├── invoice-generator.tsx   # Page-level form orchestration + save/export
│       │   ├── invoice-line-items.tsx  # Editable items with guarded add-item flow
│       │   ├── fabric-suggest-input.tsx # Searchable fabric catalog + custom entry
│       │   ├── color-suggest-input.tsx  # Common textile colors + custom entry
│       │   ├── invoice-list-table.tsx  # Table with preview, PDF export, confirmed delete
│       │   └── invoice-preview.tsx     # JSX A4 live preview (HTML, not PDF)
│       ├── services/
│       │   └── persist-invoice.ts      # Shared owner-scoped draft/export persistence
│       ├── pdf/
│       │   └── generate-invoice-pdf.ts # PDFKit A4 generator (server-only)
│       ├── schemas/
│       │   └── invoice.schema.ts       # Shared Zod schemas (client + server)
│       ├── store/
│       │   └── invoice-ui.slice.ts     # Redux UI slice (preview, dirty, zoom, etc.)
│       ├── types.ts                # Invoice line-item view + PDF document types
│       └── utils/
│           ├── build-invoice-document.ts    # Shared preview/PDF document mapping
│           ├── calculate-invoice-total.ts   # Decimal-safe money math
│           ├── download-pdf.ts              # Client download helper for PDFKit output
│           ├── format-invoice-money.ts      # en-US currency formatting
│           ├── format-invoice-number.ts     # MMF/###/YY numbering
│           ├── number-to-words.ts           # "Say total" verbal amount
│           ├── products.ts                  # Searchable description options
│           └── __tests__/                   # Unit tests for calc utils
├── lib/
│   ├── auth.ts                 # Better Auth config (mongodbAdapter, cached MongoClient)
│   ├── pi-number.ts            # Client-safe PI number generator
│   ├── auth/
│   │   ├── get-current-user.ts   # Session-based user resolution (server)
│   │   └── require-user.ts       # Requires authenticated user (server)
│   ├── cache/
│   │   ├── cache-tags.ts         # User-scoped cache tag helpers
│   │   └── cache-policy.ts       # Revalidation policy constants
│   ├── db/
│   │   ├── mongoose.ts           # Cached Mongoose connection (globalThis)
│   │   ├── model-helpers.ts      # Safe model registration (no OverwriteModelError)
│   │   └── models/
│   │       ├── index.ts            # Model barrel exports
│   │       ├── user.model.ts       # User (better-auth User + companyProfile)
│   │       ├── customer.model.ts   # Customer (owner relation, paginate v2)
│   │       ├── invoice.model.ts    # Invoice (owner/customer relations, buyer snapshot, paginate v2)
│   │       ├── account.model.ts    # Better Auth Account collection
│   │       └── session.model.ts    # Better Auth Session collection
│   ├── validations/
│   │   └── action-result.ts      # Typed ActionResult + ZodError serializer
│   └── utils.ts                  # cn() utility
├── hooks/
│   ├── use-media-query.ts          # Client media query hook
│   └── use-unsaved-changes.ts      # beforeunload unsaved-changes guard
├── store/
│   ├── index.ts                    # Redux Toolkit store (invoiceUi slice only)
│   └── provider.tsx                # Redux Provider client component
└── types/
    ├── common.ts                   # Currency, InvoiceStatus, ZoomLevel types
    └── database.ts                 # Document type re-exports

public/
└── mm-fabrics-seal.png              # Company seal for invoice preview and PDF
```

## Dashboard and customer feature files

The authenticated routes live under `src/app/dashboard/` with the `/dashboard` URL prefix: `layout.tsx` provides the dashboard shell, `invoices/page.tsx` and `invoices/new/page.tsx` provide invoice listing and creation, and `customers/page.tsx` plus `customers/new/page.tsx` provide customer listing and creation. Customer behavior lives in `src/features/customers/actions/customer-actions.ts`, `components/customer-form.tsx`, and `schemas/customer.schema.ts`. The Mongoose models are `src/lib/db/models/customer.model.ts` and `invoice.model.ts`.

## Root config files

| File                  | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `package.json`        | Dependencies, scripts (pnpm 12.14.0)          |
| `next.config.ts`      | Next.js config (Turbopack Tailwind CSS v4)    |
| `tsconfig.json`       | TypeScript strict config (`@/*` path alias)   |
| `components.json`     | shadcn/ui config (style: base-mira, lucide)   |
| `eslint.config.mjs`   | ESLint config                                 |
| `AGENTS.md`           | Agent roles & engineering guidelines          |
| `README.md`           | Project overview & setup                      |
| `FOLDER_STRUCTURE.md` | This file (single source of truth for layout) |

## Reusable dashboard utilities

`src/components/shared/list-toolbar.tsx` shares search, filter, and sort controls. `responsive-data-table.tsx` shares the responsive table/card presentation and pagination. `src/lib/utils/list-query.ts` centralizes query parsing and serialization. Both invoice and customer queries use `mongoose-paginate-v2`.
