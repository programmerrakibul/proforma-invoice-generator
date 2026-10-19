import type {
  InvoiceDocumentData,
  InvoiceDocumentNotes,
  InvoiceDocumentSeller,
} from "@/features/invoices/types";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";

export interface InvoiceDocumentInput {
  piNumber?: string;
  issueDate?: string;
  lineItems?: Array<{
    description?: string;
    style?: string;
    color?: string;
    quantity?: number | null;
    unitPrice?: number | null;
  }>;
}

export const DEFAULT_SELLER: InvoiceDocumentSeller = {
  companyName: "M.M FABRICS",
  address:
    "Sobhan Super Market, South Birampur, Madhabdi, Narsingdi, Bangladesh",
  corporateOffice:
    "House#16, B-Road, 16, Sector: 13, Uttara, Dhaka-1230, Bangladesh",
  contactNumber: "01777589989",
  email: "jewel@mmfabrics-bd.com",
};

export const DEFAULT_TERMS: string[] = [
  "Negotiable; any Bank in Bangladesh",
  "L/C amendment charge are on L/C applicant account.",
  "Maturity date must be calculated from the date of delivery.",
  "After signature the delivery challan or discrepancy won't be acceptable.",
  "Overdue interest (if any) should be pay by opener.",
  "Payment to be made on maturity date in US Dollar.",
  "All apparent errors/discrepancy (if any) would be acceptable by opener.",
];

export const INVOICE_NOTE_FIELDS: Array<{
  key: keyof InvoiceDocumentNotes;
  label: string;
}> = [
  { key: "goodsDeliveryDestination", label: "Goods Delivery Destination" },
  { key: "goodsOrigin", label: "Goods Origin" },
  { key: "advisingBank", label: "Advising Bank" },
  { key: "allowance", label: "Allowance" },
  { key: "packing", label: "Packing" },
  { key: "shipmentDate", label: "Shipment date" },
  { key: "payment", label: "Payment" },
  { key: "partialShipment", label: "Partial shipment" },
  { key: "piValidity", label: "PI validity" },
];

export function formatInvoiceIssueDate(value?: string): string {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB");
}

export function toInvoiceDocumentInput(values: {
  piNumber?: string;
  issueDate?: string;
  lineItems?: Array<{
    description?: string;
    style?: string;
    color?: string;
    quantity?: number | null;
    unitPrice?: number | null;
  } | undefined>;
}): InvoiceDocumentInput {
  return {
    piNumber: values.piNumber,
    issueDate: values.issueDate,
    lineItems: (values.lineItems ?? [])
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => ({
        description: item.description,
        style: item.style,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
  };
}

export function buildInvoiceDocument(
  input: InvoiceDocumentInput,
): InvoiceDocumentData {
  const { lineItems, subtotal, totalAmount } = calculateInvoiceTotals(
    input.lineItems ?? [],
  );

  const totalQuantity = lineItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

  return {
    piNumber: input.piNumber?.trim() || "MMF/000/00",
    issueDateLabel: formatInvoiceIssueDate(
      typeof input.issueDate === "string" ? input.issueDate : undefined,
    ),
    currency: "USD",
    seller: DEFAULT_SELLER,
    buyer: {
      name: "",
      address: "",
      destinationCountry: "",
    },
    lineItems: lineItems.map((item) => ({
      description: item.description ?? "",
      style: item.style ?? "",
      color: item.color ?? "",
      quantity: item.quantity ?? 0,
      unitPrice: item.unitPrice ?? 0,
      totalAmount: item.totalAmount,
    })),
    subtotal,
    totalAmount,
    totalQuantity,
    sayTotal: numberToWords(totalAmount, "USD"),
    notes: {},
    termsAndConditions: DEFAULT_TERMS,
  };
}
