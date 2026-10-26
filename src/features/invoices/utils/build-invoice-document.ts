import { buyerProfile } from "@/data/buyer";
import { defaultNotes, defaultTermsAndConditions } from "@/data/invoice-static";
import type {
  InvoiceDocumentData,
  InvoiceDocumentNotes,
  InvoiceDocumentSeller,
} from "@/features/invoices/types";
import {
  calculateInvoiceTotals,
  roundMoney,
} from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";

export interface InvoiceDocumentInput {
  piNumber?: string;
  issueDate?: string;
  currency?: string;
  seller?: Partial<InvoiceDocumentData["seller"]>;
  buyer?: Partial<InvoiceDocumentData["buyer"]>;
  notes?: Partial<InvoiceDocumentNotes>;
  termsAndConditions?: string[];
  lineItems?: Array<{
    fabric?: string;
    construction?: string;
    width?: string;
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
    "House#16-B6, Road#16, Sector#13, Uttara, Dhaka-1230, Bangladesh",
  contactNumber: "01777589989",
  email: "jewel@mmfabrics-bd.com",
};

export const DEFAULT_TERMS: string[] = defaultTermsAndConditions;

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

function getLegacyDescriptionParts(description?: string): {
  fabric: string;
  construction: string;
  width: string;
} {
  const lines = description?.split(/\r?\n/) ?? [];
  const constructionLine = lines.find((line) =>
    /^construction\s*:/i.test(line.trim()),
  );
  const widthLine = lines.find((line) => /^width\s*:/i.test(line.trim()));

  return {
    fabric: lines[0]?.trim() ?? "",
    construction:
      constructionLine?.replace(/^\s*construction\s*:\s*/i, "") ?? "",
    width: widthLine?.replace(/^\s*width\s*:\s*/i, "") ?? "",
  };
}

function formatWidth(width: string): string {
  return /^\d+(?:\.\d+)?$/.test(width) ? `${width}\"` : width;
}

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
  currency?: string;
  seller?: Partial<InvoiceDocumentData["seller"]>;
  buyer?: Partial<InvoiceDocumentData["buyer"]>;
  notes?: Partial<InvoiceDocumentNotes>;
  termsAndConditions?: string[];
  lineItems?: Array<
    | {
        fabric?: string;
        construction?: string;
        width?: string;
        description?: string;
        style?: string;
        color?: string;
        quantity?: number | null;
        unitPrice?: number | null;
      }
    | undefined
  >;
}): InvoiceDocumentInput {
  return {
    piNumber: values.piNumber,
    issueDate: values.issueDate,
    currency: values.currency,
    seller: values.seller,
    buyer: values.buyer,
    notes: values.notes,
    termsAndConditions: values.termsAndConditions,
    lineItems: (values.lineItems ?? [])
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => {
        const legacyParts = getLegacyDescriptionParts(item.description);
        return {
          fabric: item.fabric ?? legacyParts.fabric,
          construction: item.construction ?? legacyParts.construction,
          width: item.width ?? legacyParts.width,
          description: item.description,
          style: item.style,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      }),
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
  const totalUnitPrice = roundMoney(
    lineItems.reduce((sum, item) => sum + (item.unitPrice ?? 0), 0),
  );

  return {
    piNumber: input.piNumber?.trim() || "MMF/000/00",
    issueDateLabel: formatInvoiceIssueDate(
      typeof input.issueDate === "string" ? input.issueDate : undefined,
    ),
    currency: input.currency ?? "USD",
    seller: { ...DEFAULT_SELLER, ...input.seller },
    buyer: {
      name: input.buyer?.name ?? buyerProfile.name,
      address: input.buyer?.address ?? buyerProfile.address,
    },
    lineItems: lineItems.map((item) => {
      const fabric = item.fabric ?? "";
      const construction = item.construction ?? "";
      const width = item.width ?? "";
      const description = [
        fabric,
        `Construction: ${construction}`,
        `Width: ${formatWidth(width)}`,
      ].join("\n");

      return {
        fabric,
        construction,
        width,
        description,
        style: item.style ?? "",
        color: item.color ?? "",
        quantity: item.quantity ?? 0,
        unitPrice: item.unitPrice ?? 0,
        totalAmount: item.totalAmount,
      };
    }),
    subtotal,
    totalUnitPrice,
    totalAmount,
    totalQuantity,
    sayTotal: numberToWords(totalAmount, "USD"),
    notes: { ...defaultNotes, ...input.notes },
    termsAndConditions: input.termsAndConditions ?? defaultTermsAndConditions,
  };
}
