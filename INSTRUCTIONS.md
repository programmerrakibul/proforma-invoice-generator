# Project Setup & Implementation Instructions

## 1. Project Architecture & Feature-Based Directory Structure

Organize the codebase using a modular, feature-based directory layout under
`src/`:

```text
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   └── auth/[...all]/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── actions/
│   │   └── schemas/
│   ├── invoices/
│   │   ├── components/
│   │   │   ├── InvoiceForm.tsx
│   │   │   ├── InvoicePreview.tsx
│   │   │   ├── InvoiceTable.tsx
│   │   │   └── InvoicePdfTemplate.tsx
│   │   ├── actions/
│   │   ├── schemas/
│   │   └── utils/
│   └── profile/
├── models/               # Mongoose Models (User, Account, Session, Invoice)
├── lib/                  # Database connections, auth config, cloudinary
├── store/                # Redux Toolkit store & slices
└── types/                # Global TypeScript definitions
```

2. Technical Stack & Configuration Rules 2.1 Database & Mongoose Models MongoDB
   Connection: Implement a cached connection helper using Mongoose to prevent
   multiple connection instances in serverless environments.

Models: Explicitly define Mongoose schemas reflecting Better Auth collections
(User, Account, Session) alongside the custom Invoice collection containing
embedded or referenced line items.

2.2 Authentication (Next Auth v4 & Bcrypt) Configure Next Auth in src/lib/auth.ts
mapping standard collections (user, account, session).

Integrate bcrypt-js for password hashing during user registration workflows.

Guest Flow Rule: Unauthenticated users can access the invoice generator and
render/download previews instantly, but database persistence checks session
validity inside the Server Action; if unauthenticated, it returns data strictly
for client-side usage/PDF generation without inserting into MongoDB.

2.3 Form Management & Validation Use Zod for exhaustive schema validation.

Integrate React Hook Form with @hookform/resolvers/zod for form state management
on the client side.

Re-validate all form payloads inside Next.js Server Actions using the identical
Zod schemas before processing or persisting.

2.4 Styling & UI Components Use Tailwind CSS, Shadcn UI, and Magic UI
components. Install missing primitives via terminal as needed. Make better
ui/ux.

Support seamless light/dark/system mode via Next Themes. use magic ui animated theme
toggler with next theme.

2.5 PDF Generation & CloudinaryUse @react-pdf/renderer (react-renderer-pdf) to
construct professional, pixel-perfect proforma invoices matching the exact
layout of the provided M.M Fabrics reference sample. Configure Next Cloudinary
for asset uploads (e.g., profile avatars, corporate logo signatures).

3. Detailed Component & Page Specifications3.1 Static vs. Dynamic Content (M.M
   Fabrics Context)Static Header & Footer Elements: Company Info (M.M Fabrics,
   Sobhan Super Market, South Birampur, Madhabdi, Narsingdi; Corporate Office:
   Uttara, Dhaka), Advising Bank details (NRBC BANK LIMITED, A/C:
   5209-33300000609, Swift: NRBBBDDH, VAT: 004906505-0306), Advice notes, and
   standard Terms & Conditions (1 through 7 + Negotiable notes) must remain
   hardcoded and immutable in the invoice generator/PDF layout.Dynamic Fields:
   PI Number (MMF/MM/YY), Issue Date, Buyer/Consignee Info, and multiple line
   items (Description, Style, Color, Quantity in Yds, Unit Price in USD) must be
   fully dynamic and managed via React Hook Form.Calculations: Automatically
   compute Total Quantity, Total Amount ($Quantity \times Unit Price$), and
   render the exact verbal string format ("Say Total: USD ... Only").

   3.2 Page Routes & Requirements Login & Register Pages (/auth/login, /auth/register):
   Clean authentication forms utilizing Zod, React Hook Form, Server Actions,
   and Redux state synchronization where applicable.

Dashboard Layout (/dashboard): Protected layout incorporating a responsive
sidebar/header with user profile summary, navigation links to Invoices, Create
Invoice, and Profile settings.

Invoice Listing Page (/dashboard/invoices): A clean data table displaying saved
invoices with columns for PI Number, Issue Date, Buyer Name, Total Amount, and a
Delete action (explicitly omitting edit actions per requirements). pagination in the server side. and use shadcn ui pagination component.

Create Invoice Page (/dashboard/invoices/create): Split-screen or reactive
layout featuring the dynamic input form on one side and a real-time live invoice
preview on the other, with actions to Save to DB (if authenticated) and Download
PDF.

Profile Page (/dashboard/profile): Displays authenticated user details, account
management options, and Cloudinary-powered avatar uploads.

4. Execution Guardrails & Code Quality Standards DRY & HOFs: Create reusable
   higher-order server action wrappers for error handling, database connection
   verification, and session validation.

Performance: Mark server components explicitly, use Server Actions for
mutations, and keep client boundaries ('use client') strictly isolated to
interactive form controls and preview canvases.

Strict Types: Provide complete TypeScript code blocks with explicit types for
all parameters, state hooks, props, and server responses.
