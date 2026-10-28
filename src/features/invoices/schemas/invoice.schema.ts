import { z } from "zod";
import { INVOICE_CURRENCIES } from "@/config/bank-accounts";

const invoiceNoteSchema = z.object({
  goodsDeliveryDestination: z
    .string()
    .trim()
    .min(1, "Delivery destination is required.")
    .max(2000, "Delivery destination must be 2000 characters or fewer."),
  goodsOrigin: z
    .string()
    .trim()
    .min(1, "Goods origin is required.")
    .max(2000, "Goods origin must be 2000 characters or fewer."),
  advisingBank: z
    .string()
    .trim()
    .min(1, "Advising bank details are required.")
    .max(2000, "Advising bank details must be 2000 characters or fewer."),
  allowance: z
    .string()
    .trim()
    .min(1, "Allowance is required.")
    .max(2000, "Allowance must be 2000 characters or fewer."),
  packing: z
    .string()
    .trim()
    .min(1, "Packing details are required.")
    .max(2000, "Packing details must be 2000 characters or fewer."),
  shipmentDate: z
    .string()
    .trim()
    .min(1, "Shipment date is required.")
    .max(2000, "Shipment date must be 2000 characters or fewer."),
  payment: z
    .string()
    .trim()
    .min(1, "Payment terms are required.")
    .max(2000, "Payment terms must be 2000 characters or fewer."),
  partialShipment: z
    .string()
    .trim()
    .min(1, "Partial shipment terms are required.")
    .max(2000, "Partial shipment terms must be 2000 characters or fewer."),
  piValidity: z
    .string()
    .trim()
    .min(1, "PI validity is required.")
    .max(2000, "PI validity must be 2000 characters or fewer."),
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
    .max(100, "Construction must be 100 characters or fewer.")
    .transform((val) => val.replaceAll("*", "x")),
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
  quantity: z.coerce
    .number<number>()
    .finite()
    .min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce
    .number<number>()
    .finite()
    .min(0.01, "Unit price must be greater than 0."),
  totalPrice: z.coerce.number<number>().finite().min(0).default(0),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().regex(/^[a-f\d]{24}$/i, "Select a customer."),
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
  deliveryDate: z.coerce.date<string | Date>().optional(),
  currency: z.enum(INVOICE_CURRENCIES).default("USD"),
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
  termsAndConditions: z.array(
    z
      .string()
      .trim()
      .min(1, "Terms cannot be empty.")
      .max(1000, "Each term must be 1000 characters or fewer."),
  ),
});

export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;
export type InvoiceNotesInput = z.infer<typeof invoiceNoteSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type InvoiceFormValues = z.input<typeof createInvoiceSchema>;
