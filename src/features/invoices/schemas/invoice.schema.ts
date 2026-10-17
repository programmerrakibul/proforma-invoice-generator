import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Primitive reusable validators                                      */
/* ------------------------------------------------------------------ */

const trimmedString = (max: number) =>
  z.preprocess(
    (val: unknown) => (typeof val === "string" ? val.trim() : val),
    z.string().min(1, "This field is required").max(max, `Must be ${max} characters or fewer`),
  );

const currencyCode = z
  .string()
  .min(3, "Currency must be a 3-letter code")
  .max(3, "Currency must be a 3-letter code")
  .refine((val) => /^[A-Z]{3}$/.test(val), {
    message: "Currency must be an uppercase 3-letter code (e.g. USD)",
  });

const isoDateString = z.preprocess(
  (val: unknown) => (typeof val === "string" ? val : String(val ?? "")),
  z.string().refine((val) => {
    if (!val) return false;
    const d = new Date(val);
    return !isNaN(d.getTime());
  }, "Enter a valid date"),
);

/* ------------------------------------------------------------------ */
/* Line item                                                          */
/* ------------------------------------------------------------------ */

export const invoiceLineItemSchema = z.object({
  description: trimmedString(200),
  style: trimmedString(100).optional().default(""),
  color: trimmedString(100).optional().default(""),
  quantity: z
    .preprocess(
      (val: unknown) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0.001, "Quantity must be greater than zero"),
    )
    .optional(),
  unitPrice: z
    .preprocess(
      (val: unknown) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().min(0, "Unit price must be zero or greater"),
    )
    .optional(),
  unit: trimmedString(20).default("Yds"),
});

export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;

/* ------------------------------------------------------------------ */
/* Invoice details                                                    */
/* ------------------------------------------------------------------ */

export const invoiceDetailsSchema = z.object({
  piNumber: trimmedString(50),
  issueDate: isoDateString,
  currency: currencyCode.default("USD"),
});

export type InvoiceDetails = z.infer<typeof invoiceDetailsSchema>;

/* ------------------------------------------------------------------ */
/* Buyer / seller / notes / signatures sub-schemas                    */
/* ------------------------------------------------------------------ */

const partySchema = z.object({
  name: trimmedString(200).optional().default(""),
  address: trimmedString(300).optional().default(""),
  destinationCountry: trimmedString(100).optional().default(""),
});

const sellerSchema = z.object({
  companyName: trimmedString(200).optional().default(""),
  address: trimmedString(300).optional().default(""),
  corporateOffice: trimmedString(200).optional().default(""),
  contactNumber: trimmedString(50).optional().default(""),
  email: z.string().email("Enter a valid email").optional().default(""),
});

const notesSchema = z.object({
  sayTotal: z.string().default(""),
  goodsDeliveryDestination: z.string().default(""),
  goodsOrigin: z.string().default(""),
  advisingBank: z.string().default(""),
  allowance: z.string().default(""),
  packing: z.string().default(""),
  shipmentDate: z.string().default(""),
  payment: z.string().default(""),
  partialShipment: z.string().default(""),
  piValidity: z.string().default(""),
});

const signaturesSchema = z.object({
  buyerLabel: z.string().default(""),
  sellerLabel: z.string().default(""),
  stampUrl: z.string().default(""),
  includeBuyerSignature: z.boolean().default(false),
  includeSellerSignature: z.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/* Create / update                                                    */
/* ------------------------------------------------------------------ */

const baseInvoiceSchema = z.object({
  piNumber: trimmedString(50),
  issueDate: isoDateString,
  currency: currencyCode.default("USD"),
  status: z
    .enum(["draft", "ready", "exported", "archived"])
    .default("draft"),
  seller: sellerSchema,
  buyer: partySchema,
  lineItems: z.array(invoiceLineItemSchema).min(1, "Add at least one product"),
  subtotal: z.number().min(0, "Subtotal must be zero or greater").default(0),
  totalAmount: z.number().min(0, "Total amount must be zero or greater").default(0),
  notes: notesSchema,
  termsAndConditions: z.array(z.string()).default([]),
  signatures: signaturesSchema,
});

export const createInvoiceSchema = baseInvoiceSchema;

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const updateInvoiceSchema = baseInvoiceSchema.partial().refine(
  (data) => {
    if (data.lineItems && data.lineItems.length === 0) {
      return false;
    }
    return true;
  },
  { message: "Add at least one product", path: ["lineItems"] },
);

export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

/* ------------------------------------------------------------------ */
/* Cross-field validation                                             */
/* ------------------------------------------------------------------ */

export const completeInvoiceSchema = createInvoiceSchema.superRefine((data, ctx) => {
  const expectedSubtotal = data.lineItems.reduce(
    (sum, item) => sum + (Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0)),
    0,
  );
  const expectedTotal = expectedSubtotal;

  if (Math.abs(Number(data.subtotal ?? 0) - expectedSubtotal) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Subtotal does not match line items",
      path: ["subtotal"],
    });
  }
  if (Math.abs(Number(data.totalAmount ?? 0) - expectedTotal) > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Total amount does not match line items",
      path: ["totalAmount"],
    });
  }
});

export type CompleteInvoiceInput = z.infer<typeof completeInvoiceSchema>;
