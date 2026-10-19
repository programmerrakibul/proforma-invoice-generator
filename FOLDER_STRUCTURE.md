# Folder Structure

Source-of-truth layout for the Proforma Invoice Generator (M.M FABRICS).
Referenced by AGENTS.md and README.md.

```plaintext
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx              # Root layout (Providers + StoreProvider, fonts, metadata)
│   ├── page.tsx                # Landing page
│   ├── auth/
│   │   ├── login/page.tsx      # Sign-in page (Better Auth email/password)
│   │   └── register/page.tsx   # Sign-up page (Better Auth email/password)
│   ├── api/
│   │   └── auth/[...all]/route.ts  # Better Auth Next.js handler (toNextJsHandler)
│   └── invoices/
│       ├── page.tsx            # Invoice table (filters, pagination; auth required; async searchParams)
│       └── new/page.tsx        # Invoice studio (draft save for signed-in users; guest PDF export)
├── assets/
│   └── logo.png                 # M.M FABRICS mark used by the shared site header
├── components/
│   ├── providers.tsx           # BetterAuth AuthProvider + SessionProvider wrapper
│   ├── layout/
│   │   ├── app-sidebar.tsx     # Responsive navigation sidebar
│   │   ├── mobile-nav.tsx      # Mobile top navigation
│   │   └── page-header.tsx     # Breadcrumb + page title
│   │   └── site-header.tsx     # Shared marketing/auth navigation header
│   ├── shared/
│   │   ├── container.tsx
│   │   ├── confirm-dialog.tsx  # Reusable confirmation dialog
│   │   ├── empty-state.tsx     # Empty state placeholder
│   │   ├── error-state.tsx     # Error state placeholder
│   │   └── loading-state.tsx   # Loading state placeholder
│   └── ui/                     # shadcn/ui components (button, input, select, etc.)
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── auth-field.tsx      # Shared labeled auth input and error state
│   │   │   ├── auth-page.tsx       # Shared premium auth page frame
│   │   │   ├── login-form.tsx      # Validated Better Auth sign-in flow
│   │   │   └── register-form.tsx   # Validated Better Auth registration flow
│   │   ├── schemas/
│   │   │   └── auth.schema.ts      # Shared Zod schemas and auth form types
│   │   └── utils/
│   │       └── auth-redirect.ts    # Same-site auth redirect validation
│   └── invoices/
│       ├── actions/
│       │   ├── create-invoice.ts       # createInvoiceAction + getNextPiNumber (optional auth)
│       │   ├── update-invoice.ts       # updateInvoiceAction (ownership: _id + ownerId)
│       │   ├── delete-invoice.ts       # deleteInvoiceAction (ownership: _id + ownerId)
│       │   ├── list-invoices.ts        # listInvoicesAction (paginated, auth required)
│       │   └── export-invoice-pdf.ts   # Export PDF; persist as exported when signed in
│       ├── components/
│       │   ├── invoice-form.tsx        # Multi-section invoice form (RHF + Zod)
│       │   ├── invoice-generator.tsx   # Page-level form orchestration + save/export
│       │   ├── invoice-line-items.tsx  # Line-item CRUD with combobox description
│       │   ├── invoice-list-table.tsx  # Invoice table with preview and confirmed delete
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
│           ├── format-invoice-money.ts      # en-ES currency formatting
│           ├── format-invoice-number.ts     # MMF/###/YY numbering
│           ├── number-to-words.ts           # "Say total" verbal amount
│           ├── products.ts                  # Searchable description options
│           └── __tests__/                   # Unit tests for calc utils
├── lib/
│   ├── auth.ts                 # Better Auth config (mongodbAdapter, cached MongoClient)
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
│   │       ├── invoice.model.ts    # Invoice (ownerId relation, embedded line items)
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
