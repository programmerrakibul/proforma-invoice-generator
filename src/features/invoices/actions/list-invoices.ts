"use server";

import mongoose from "mongoose";

import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InvoiceModel } from "@/lib/db/models";
import { ActionResult } from "@/lib/validations/action-result";

interface RawInvoice {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  issueDate: Date;
  status: string;
  buyer: { name: string };
  totalAmount: number;
  currency: string;
  updatedAt: Date;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  status: "draft" | "ready" | "exported" | "archived";
  buyerName: string;
  totalAmount: number;
  currency: string;
  updatedAt: Date;
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
  status?: string;
  sort?: string;
}

export async function listInvoicesAction(
  input: ListInvoicesInput = {},
): Promise<ActionResult<PaginatedInvoices>> {
  "use server";

  try {
    const user = await requireUser();
    await connectToDatabase();

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 10));
    const skip = (page - 1) * pageSize;

    const ownerId = new mongoose.Types.ObjectId(user.id);

    const filter: Record<string, unknown> = { ownerId };

    if (input.status && input.status !== "all") {
      filter.status = input.status;
    }

    if (input.search) {
      const searchRegex = new RegExp(input.search, "i");
      filter.$or = [
        { invoiceNumber: searchRegex },
        { "buyer.name": searchRegex },
      ];
    }

    const sort: Record<string, 1 | -1> = { updatedAt: -1 };
    if (input.sort === "newest") {
      sort.updatedAt = -1;
    } else if (input.sort === "oldest") {
      sort.updatedAt = 1;
    } else if (input.sort === "highest") {
      sort.totalAmount = -1;
    } else if (input.sort === "lowest") {
      sort.totalAmount = 1;
    }

    const [rawItems, total] = await Promise.all([
      InvoiceModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean<RawInvoice[]>(),
      InvoiceModel.countDocuments(filter),
    ]);

    const items: InvoiceListItem[] = rawItems.map((item) => ({
      id: String(item._id),
      invoiceNumber: item.invoiceNumber,
      issueDate: item.issueDate,
      status: item.status as InvoiceListItem["status"],
      buyerName: item.buyer.name,
      totalAmount: item.totalAmount,
      currency: item.currency,
      updatedAt: item.updatedAt,
    }));

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
