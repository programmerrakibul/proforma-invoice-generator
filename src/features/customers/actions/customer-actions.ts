"use server";

import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "@/features/customers/schemas/customer.schema";
import { CustomerModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import type { ActionResult } from "@/lib/validations/action-result";
import { zodErrorToActionResult } from "@/lib/validations/action-result";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface CustomerListItem {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  createdAt: string;
}
export interface CustomerPageResult {
  items: CustomerListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
interface CustomerPageDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  email?: string | null;
  phone?: string | null;
  createdAt: Date;
}
type CustomerSearchField = "name" | "address" | "email" | "phone";
interface CustomerSearchFilter {
  $or?: Array<Partial<Record<CustomerSearchField, RegExp>>>;
}
const querySchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
  search: z.string().trim().max(100).default(""),
  sort: z.enum(["name", "newest", "oldest"]).default("newest"),
  filter: z.enum(["all", "email", "phone"]).default("all"),
});
export type CustomerListQuery = z.input<typeof querySchema>;

export async function createCustomerAction(
  input: CreateCustomerInput
): Promise<ActionResult<{ customerId: string }>> {
  try {
    const values = createCustomerSchema.parse(input);
    await connectToDatabase();
    const customer = await CustomerModel.create(values);

    revalidatePath("/dashboard/customers");

    return {
      ok: true,
      data: { customerId: String(customer._id) },
      message: "Customer created.",
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return zodErrorToActionResult(error, "Please fix the customer details.");
    console.error("Customer creation failed.", error);
    return { ok: false, message: "Failed to create customer." };
  }
}

export async function updateCustomerAction(
  customerId: string,
  input: CreateCustomerInput
): Promise<ActionResult<{ customerId: string }>> {
  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return zodErrorToActionResult(
      parsed.error,
      "Please fix the customer details."
    );
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return { ok: false, message: "Customer not found." };
  }

  try {
    await connectToDatabase();
    const customer = await CustomerModel.findByIdAndUpdate(
      customerId,
      {
        ...parsed.data,
        email: parsed.data.email ?? "",
        phone: parsed.data.phone ?? "",
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return { ok: false, message: "Customer not found." };
    }

    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/invoices/new");

    return {
      ok: true,
      data: { customerId: String(customer._id) },
      message: "Customer updated.",
    };
  } catch (error) {
    console.error("Customer update failed.", error);
    return { ok: false, message: "Failed to update customer." };
  }
}

export async function listCustomersAction(
  input: CustomerListQuery = {}
): Promise<ActionResult<CustomerPageResult>> {
  try {
    const values = querySchema.parse(input);
    await connectToDatabase();
    const filter: CustomerSearchFilter = {};

    if (values.search) {
      const regex = new RegExp(
        values.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      const fields: Array<"name" | "address" | "email" | "phone"> =
        values.filter === "email"
          ? ["email"]
          : values.filter === "phone"
            ? ["phone"]
            : ["name", "address", "email", "phone"];

      filter.$or = fields.map((field) => {
        switch (field) {
          case "name":
            return { name: regex };
          case "address":
            return { address: regex };
          case "email":
            return { email: regex };
          case "phone":
            return { phone: regex };
        }
      });
    }
    const sort: Record<string, 1 | -1> =
      values.sort === "name"
        ? { name: 1 as const }
        : {
            createdAt: values.sort === "oldest" ? (1 as const) : (-1 as const),
          };

    const result = await CustomerModel.paginate<CustomerPageDocument>(filter, {
      page: values.page,
      limit: values.pageSize,
      sort,
      lean: true,
    });

    const totalPages = result.totalPages;
    const page = totalPages ? Math.min(result.page ?? 1, totalPages) : 1;
    const rows =
      page === result.page
        ? result.docs
        : (
            await CustomerModel.paginate<CustomerPageDocument>(filter, {
              page,
              limit: values.pageSize,
              sort,
              lean: true,
            })
          ).docs;

    const items: CustomerListItem[] = rows.map((row) => ({
      id: String(row._id),
      name: row.name,
      address: row.address,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      createdAt: row.createdAt.toISOString(),
    }));

    return {
      ok: true,
      data: {
        items,
        total: result.totalDocs,
        page,
        pageSize: values.pageSize,
        totalPages,
      },
      message: "Customers loaded.",
    };
  } catch {
    return { ok: false, message: "Failed to load customers." };
  }
}

export async function getCustomersForInvoiceAction(): Promise<
  ActionResult<CustomerListItem[]>
> {
  try {
    await connectToDatabase();
    const rows = await CustomerModel.find({}).sort({ name: 1 }).lean();

    return {
      ok: true,
      data: rows.map((row) => ({
        id: String(row._id),
        name: row.name,
        address: row.address,
        email: row.email ?? undefined,
        phone: row.phone ?? undefined,
        createdAt: row.createdAt.toISOString(),
      })),
      message: "Customers loaded.",
    };
  } catch {
    return { ok: false, message: "Failed to load customers." };
  }
}
