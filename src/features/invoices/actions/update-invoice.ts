"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { getDefaultGoodsDetails } from "@/data/goods";
import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { requireUser } from "@/lib/auth/require-user";
import { CustomerModel, InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";

export async function updateInvoiceAction(
  invoiceId: string,
  input: InvoiceFormValues
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

    const { lineItems, subtotal, totalAmount } = calculateInvoiceTotals(
      validated.lineItems
    );

    const notes = validated.notes.map((note) => ({ ...note }));
    const destinationIndex = notes.findIndex(
      (note) => note.key === "goodsDeliveryDestination"
    );

    if (destinationIndex >= 0) {
      notes[destinationIndex].value = customer.name;
    } else {
      const destination = getDefaultGoodsDetails(validated.currency).find(
        (note) => note.key === "goodsDeliveryDestination"
      );
      if (destination) {
        notes.unshift({ ...destination, value: customer.name });
      }
    }

    await InvoiceModel.updateOne(
      { _id: invoiceId, ownerId: user.id, piNumber: validated.piNumber },
      {
        $set: {
          issueDate: new Date(validated.issueDate),
          currency: validated.currency,
          ...(validated.deliveryDate
            ? { deliveryDate: validated.deliveryDate }
            : {}),
          buyerId: customer._id,
          buyer: { name: customer.name, address: customer.address },
          lineItems: lineItems.map((item) => ({
            fabric: item.fabric,
            construction: item.construction,
            width: item.width,
            style: item.style,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.totalAmount,
          })),
          subtotal,
          totalQuantity: lineItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          totalAmount,
          notes,
          termsAndConditions:
            validated.currency === "BDT" ? [] : validated.termsAndConditions,
        },
        ...(validated.deliveryDate ? {} : { $unset: { deliveryDate: "" } }),
      },
      { runValidators: true }
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
        "Please fix the highlighted fields."
      );
    }
    return { ok: false, message: "Failed to update invoice." };
  }
}
