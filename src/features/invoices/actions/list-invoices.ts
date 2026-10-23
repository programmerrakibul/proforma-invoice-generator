"use server";

import mongoose from "mongoose";
import { z } from "zod";

import type {
  InvoiceDocumentData,
  InvoiceDocumentNotes,
} from "@/features/invoices/types";
import { buildInvoiceDocument } from "@/features/invoices/utils/build-invoice-document";
import { requireUser } from "@/lib/auth/require-user";
import { InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import type { ActionResult } from "@/lib/validations/action-result";

interface RawLineItem {
  description: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface RawInvoice {
  _id: mongoose.Types.ObjectId;
  piNumber: string;
  issueDate: Date;
  status: string;
  currency: string;
  buyer: { name: string; address: string; destinationCountry?: string };
  seller?: InvoiceDocumentData["seller"];
  lineItems: RawLineItem[];
  notes?: Partial<InvoiceDocumentNotes>;
  termsAndConditions?: string[];
  totalAmount: number;
  totalQuantity?: number;
  updatedAt: Date;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  status: "draft" | "exported";
  buyerName: string;
  currency: string;
  totalQuantity: number;
  totalUnitPrice: number;
  totalAmount: number;
  preview: InvoiceDocumentData;
}

export interface PaginatedInvoices {
  items: InvoiceListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const listInvoicesInputSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  search: z.string().trim().max(100).optional(),
  status: z.enum(["all", "draft", "exported"]).optional(),
  sort: z.enum(["newest", "oldest", "highest", "lowest"]).optional(),
});

export type ListInvoicesInput = z.infer<typeof listInvoicesInputSchema>;

interface InvoiceQueryFilter {
  ownerId: mongoose.Types.ObjectId;
  status?: "draft" | "exported";
  $or?: Array<{ piNumber?: RegExp; "buyer.name"?: RegExp }>;
}

export async function listInvoicesAction(
  input: ListInvoicesInput = {},
): Promise<ActionResult<PaginatedInvoices>> {
  try {
    const validatedInput = listInvoicesInputSchema.parse(input);
    const user = await requireUser();
    await connectToDatabase();

    const requestedPage = validatedInput.page ?? 1;
    const pageSize = validatedInput.pageSize ?? 10;
    const ownerId = new mongoose.Types.ObjectId(user.id);
    const filter: InvoiceQueryFilter = { ownerId };

    if (validatedInput.status && validatedInput.status !== "all") {
      filter.status = validatedInput.status;
    }
    if (validatedInput.search) {
      const escapedSearch = validatedInput.search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const searchRegex = new RegExp(escapedSearch, "i");
      filter.$or = [{ piNumber: searchRegex }, { "buyer.name": searchRegex }];
    }

    const sort: Record<string, 1 | -1> = { updatedAt: -1 };
    if (validatedInput.sort === "oldest") sort.updatedAt = 1;
    if (validatedInput.sort === "highest") sort.totalAmount = -1;
    if (validatedInput.sort === "lowest") sort.totalAmount = 1;

    const total = await InvoiceModel.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);
    const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
    const rawItems = await InvoiceModel.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean<RawInvoice[]>();

    const items: InvoiceListItem[] = rawItems.map((item) => {
      const issueDate = item.issueDate.toISOString();
      const preview = buildInvoiceDocument({
        piNumber: item.piNumber,
        issueDate,
        currency: item.currency ?? "USD",
        seller: item.seller,
        buyer: item.buyer,
        lineItems: item.lineItems,
        notes: item.notes,
        termsAndConditions: item.termsAndConditions,
      });

      return {
        id: String(item._id),
        invoiceNumber: item.piNumber,
        issueDate,
        status: (item.status ?? "draft") as InvoiceListItem["status"],
        buyerName: item.buyer.name,
        currency: preview.currency,
        totalQuantity: preview.totalQuantity,
        totalUnitPrice: preview.totalUnitPrice,
        totalAmount: preview.totalAmount,
        preview,
      };
    });

    return {
      ok: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages,
      },
      message: "Invoices loaded.",
    };
  } catch {
    return { ok: false, message: "Failed to load invoices." };
  }
}
