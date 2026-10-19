"use server";

import mongoose from "mongoose";

import { buildInvoiceDocument } from "@/features/invoices/utils/build-invoice-document";
import type { InvoiceDocumentData, InvoiceDocumentNotes } from "@/features/invoices/types";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InvoiceModel } from "@/lib/db/models";
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
  status: "draft" | "ready" | "exported" | "archived";
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

interface ListInvoicesInput {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "all" | "draft" | "ready" | "exported" | "archived";
  sort?: string;
}

interface InvoiceQueryFilter {
  ownerId: mongoose.Types.ObjectId;
  status?: "draft" | "ready" | "exported" | "archived";
  $or?: Array<{ piNumber?: RegExp; "buyer.name"?: RegExp }>;
}

export async function listInvoicesAction(
  input: ListInvoicesInput = {},
): Promise<ActionResult<PaginatedInvoices>> {
  try {
    const user = await requireUser();
    await connectToDatabase();

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 10));
    const skip = (page - 1) * pageSize;
    const ownerId = new mongoose.Types.ObjectId(user.id);
    const filter: InvoiceQueryFilter = { ownerId };

    if (input.status && input.status !== "all") filter.status = input.status;
    if (input.search) {
      const escapedSearch = input.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");
      filter.$or = [{ piNumber: searchRegex }, { "buyer.name": searchRegex }];
    }

    const sort: Record<string, 1 | -1> = { updatedAt: -1 };
    if (input.sort === "oldest") sort.updatedAt = 1;
    if (input.sort === "highest") sort.totalAmount = -1;
    if (input.sort === "lowest") sort.totalAmount = 1;

    const [rawItems, total] = await Promise.all([
      InvoiceModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean<RawInvoice[]>(),
      InvoiceModel.countDocuments(filter),
    ]);

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
        totalPages: Math.ceil(total / pageSize),
      },
      message: "Invoices loaded.",
    };
  } catch {
    return { ok: false, message: "Failed to load invoices." };
  }
}
