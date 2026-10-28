import { buyerProfile } from "@/data/buyer";
import { companyProfile } from "@/data/company";
import { getBankAccountDetails } from "@/data/bank-accounts";
import { getDefaultGoodsDetails } from "@/data/goods";
import { defaultTermsAndConditions } from "@/data/terms-and-conditions";
import type { InvoiceCurrency } from "@/config/bank-accounts";
import type {
  InvoiceDocumentData,
  InvoiceDocumentNotes,
  InvoiceDocumentNotesInput,
  InvoiceDocumentSeller,
  LegacyInvoiceDocumentNotes,
} from "@/features/invoices/types";
import {
  calculateInvoiceTotals,
  roundMoney,
} from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";

export interface InvoiceDocumentInput {
  piNumber?: string;
  issueDate?: string;
  deliveryDate?: string | Date;
  currency?: InvoiceCurrency;
  seller?: Partial<InvoiceDocumentData["seller"]>;
  buyer?: Partial<InvoiceDocumentData["buyer"]>;
  notes?: InvoiceDocumentNotesInput | LegacyInvoiceDocumentNotes;
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

export const DEFAULT_SELLER: InvoiceDocumentSeller = { ...companyProfile };

export const DEFAULT_TERMS: string[] = defaultTermsAndConditions;

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

export function formatInvoiceDate(value?: string | Date): string {
  if (!value) {
    return "";
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return parsed.toLocaleDateString("en-GB", { timeZone: "UTC" });
}

function normalizeInvoiceNotes(
  notes: InvoiceDocumentNotesInput | LegacyInvoiceDocumentNotes | undefined,
  currency: InvoiceCurrency,
  buyerName: string,
): InvoiceDocumentNotes {
  const defaultNotes = getDefaultGoodsDetails(currency);
  const legacyNotes = Array.isArray(notes) ? undefined : notes;
  const normalizedNotes = Array.isArray(notes)
    ? notes.map((note) => ({
        key: note.key ?? "",
        label: note.label ?? "",
        value: note.value ?? "",
      }))
    : defaultNotes.map((defaultNote) => {
        const key = defaultNote.key as keyof LegacyInvoiceDocumentNotes;
        const legacyValue = legacyNotes?.[key];
        return {
          ...defaultNote,
          value:
            legacyValue ??
            (defaultNote.key === "advisingBank"
              ? getBankAccountDetails(currency)
              : defaultNote.value),
        };
      });

  const destination = normalizedNotes.find(
    (note) => note.key === "goodsDeliveryDestination",
  );
  if (destination) {
    destination.value = buyerName;
  } else {
    const defaultDestination = defaultNotes.find(
      (note) => note.key === "goodsDeliveryDestination",
    );
    if (defaultDestination) {
      normalizedNotes.unshift({ ...defaultDestination, value: buyerName });
    }
  }

  return normalizedNotes;
}

export function toInvoiceDocumentInput(values: {
  piNumber?: string;
  issueDate?: string;
  deliveryDate?: string | Date;
  currency?: InvoiceCurrency;
  seller?: Partial<InvoiceDocumentData["seller"]>;
  buyer?: Partial<InvoiceDocumentData["buyer"]>;
  notes?: InvoiceDocumentNotesInput | LegacyInvoiceDocumentNotes;
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
    deliveryDate: values.deliveryDate,
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
    piNumber: input.piNumber?.trim() || "MMF-000000-0000",
    issueDateLabel: formatInvoiceDate(
      typeof input.issueDate === "string" ? input.issueDate : undefined,
    ),
    deliveryDateLabel: formatInvoiceDate(input.deliveryDate),
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
    sayTotal: numberToWords(totalAmount, input.currency ?? "USD"),
    notes: normalizeInvoiceNotes(
      input.notes,
      input.currency ?? "USD",
      input.buyer?.name ?? buyerProfile.name,
    ),
    termsAndConditions:
      input.currency === "BDT"
        ? []
        : (input.termsAndConditions ?? defaultTermsAndConditions).map((term) =>
            term === "Payment to be made on maturity date in US Dollar."
              ? "Payment to be made on maturity date in the invoice currency."
              : term,
          ),
  };
}
