"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { getDefaultGoodsDetails } from "@/data/goods";
import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { requireUser } from "@/lib/auth/require-user";
import { CustomerModel, InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";
import { calculateInvoiceTotals } from "../utils/calculate-invoice-total";

export async function updateInvoiceAction(
  invoiceId: string,
  input: InvoiceFormValues,
): Promise<ActionResult<{ invoiceId: string }>> {
  "use server";

  try {
    const user = await requireUser();
    const validated = createInvoiceSchema.parse(input);

    const query = {
      _id: invoiceId,
      ownerId: user.id,
      piNumber: validated.piNumber,
    };

    await connectToDatabase();

    // Ownership enforced: query by _id and ownerId together.
    const existing = await InvoiceModel.exists(query);

    if (!existing) {
      return {
        ok: false,
        message: "Invoice not found or you do not own it.",
      };
    }

    const customer = await CustomerModel.findOne({
      _id: validated.customerId,
    })
      .select("-__v -email -phone")
      .lean();

    if (!customer) return { ok: false, message: "Customer not found." };

    const notes = validated.notes;
    const destinationIndex = notes.findIndex(
      (note) => note.key === "goodsDeliveryDestination",
    );

    if (destinationIndex >= 0) {
      notes[destinationIndex].value = customer.name;
    } else {
      const destination = getDefaultGoodsDetails(validated.currency).find(
        (note) => note.key === "goodsDeliveryDestination",
      );
      if (destination) {
        notes.unshift({ ...destination, value: customer.name });
      }
    }

    const { lineItems, totalQuantity, totalUnitPrice, totalAmount } =
      calculateInvoiceTotals(validated.lineItems);

    await InvoiceModel.updateOne(
      { _id: invoiceId, ownerId: user.id, piNumber: validated.piNumber },
      {
        $set: {
          ...validated,
          issueDate: new Date(validated.issueDate),
          currency: validated.currency,
          ...(validated.deliveryDate
            ? { deliveryDate: validated.deliveryDate }
            : {}),
          buyerId: customer._id,
          buyer: { name: customer.name, address: customer.address },
          lineItems,
          totalQuantity,
          totalUnitPrice,
          totalAmount,
          hsoCode: validated.hsoCode,
          notes,
          termsAndConditions:
            validated.currency === "BDT" ? [] : validated.termsAndConditions,
        },
        ...(validated.deliveryDate ? {} : { $unset: { deliveryDate: "" } }),
      },
      { runValidators: true },
    );

    revalidatePath("/dashboard/invoices");

    return {
      ok: true,
      data: { invoiceId },
      message: "Invoice updated.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{ invoiceId: string }>(
        error,
        "Please fix the highlighted fields.",
      );
    }
    return { ok: false, message: "Failed to update invoice." };
  }
}
