import { z } from "zod";

const invoiceNoteSchema = z.object({
  goodsDeliveryDestination: z
    .string()
    .trim()
    .min(1, "Delivery destination is required."),
  goodsOrigin: z.string().trim().min(1, "Goods origin is required."),
  advisingBank: z.string().trim().min(1, "Advising bank details are required."),
  allowance: z.string().trim().min(1, "Allowance is required."),
  packing: z.string().trim().min(1, "Packing details are required."),
  shipmentDate: z.string().trim().min(1, "Shipment date is required."),
  payment: z.string().trim().min(1, "Payment terms are required."),
  partialShipment: z
    .string()
    .trim()
    .min(1, "Partial shipment terms are required."),
  piValidity: z.string().trim().min(1, "PI validity is required."),
});

export const invoiceLineItemSchema = z.object({
  fabric: z
    .string()
    .trim()
    .min(1, "Fabric is required.")
    .max(300, "Fabric must be 300 characters or fewer."),
  construction: z
    .string()
    .trim()
    .min(1, "Construction is required.")
    .max(100, "Construction must be 100 characters or fewer."),
  width: z
    .string()
    .trim()
    .min(1, "Width is required.")
    .max(6, "Width must be 6 characters or fewer.")
    .refine(
      (value) =>
        /^\d+(?:\.\d+)?$/.test(value) &&
        Number(value) >= 40 &&
        Number(value) <= 80,
      "Width must be a number from 40 to 80 inches.",
    ),
  style: z
    .string()
    .trim()
    .min(1, "Style is required.")
    .max(150, "Style must be 150 characters or fewer."),
  color: z
    .string()
    .trim()
    .min(1, "Color is required.")
    .max(50, "Color must be 50 characters or fewer."),
  quantity: z.coerce.number().finite().min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce
    .number()
    .finite()
    .min(0.01, "Unit price must be greater than 0."),
  totalPrice: z.coerce.number().finite().min(0).default(0),
});

export const createInvoiceSchema = z.object({
  piNumber: z
    .string()
    .trim()
    .min(1, "PI number is required.")
    .max(50, "PI number must be 50 characters or fewer."),
  issueDate: z
    .string()
    .trim()
    .min(1, "Issue date is required.")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Enter a valid issue date.",
    ),
  currency: z.enum(["USD", "EUR", "GBP", "BDT"]).default("USD"),
  buyer: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Buyer name is required.")
      .max(200, "Buyer name must be 200 characters or fewer."),
    address: z
      .string()
      .trim()
      .min(1, "Buyer address is required.")
      .max(500, "Buyer address must be 500 characters or fewer."),
  }),
  lineItems: z
    .array(invoiceLineItemSchema)
    .min(1, "Add at least one complete line item."),
  notes: invoiceNoteSchema,
  termsAndConditions: z
    .array(z.string().trim().min(1))
    .min(1, "At least one term is required."),
});

export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;
export type InvoiceNotesInput = z.infer<typeof invoiceNoteSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
