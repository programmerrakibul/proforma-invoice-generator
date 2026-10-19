import { z } from "zod";

const isoDateString = z.preprocess(
  (val: unknown) => (typeof val === "string" ? val : String(val ?? "")),
  z.string().refine((val) => {
    if (!val) return false;
    const d = new Date(val);
    return !isNaN(d.getTime());
  }, "Enter a valid date"),
);

export const invoiceLineItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required!")
    .max(300, "Must be 300 characters or fewer!"),
  style: z
    .string()
    .trim()
    .min(1, "Style is required!")
    .max(150, "Must be 150 characters or fewer!"),
  color: z
    .string()
    .trim()
    .min(1, "Color is required!")
    .max(50, "Must be 50 characters or fewer!"),
  quantity: z.coerce
    .number()
    .positive("Quantity must be a positive number")
    .min(1, "Quantity must be greater than 0!")
    .default(1),
  unitPrice: z.coerce
    .number()
    .positive("Price must be a positive number!")
    .min(0, "Price must be greater than 0!")
    .default(0),
  totalPrice: z.coerce.number().min(0).default(0),
});

export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;

export const createInvoiceSchema = z.object({
  piNumber: z
    .string()
    .trim()
    .min(1, "PI is required!")
    .max(50, "Must be 50 characters or fewer!"),
  issueDate: isoDateString,
  lineItems: z.array(invoiceLineItemSchema),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
