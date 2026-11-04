"use server";

import { requireUser } from "@/lib/auth/require-user";
import { InvoiceModel } from "@/lib/db/models";

export const getInvoiceByIdAction = async (invoiceId: string) => {
  try {
    const user = await requireUser();

    const invoice = await InvoiceModel.findOne({
      _id: invoiceId,
      ownerId: user.id,
    })
      .select("-__v -piNumberVersion")
      .lean();

    if (!invoice) {
      return {
        ok: false,
        message: `Invoice with ID: ${invoiceId} not found.`,
      };
    }

    const data = {
      ...invoice,
      _id: invoice._id.toString(),
      ownerId: invoice.ownerId.toString(),
      buyerId: invoice.buyerId.toString(),
      lineItems: invoice.lineItems.map((item) => {
        const { totalAmount, ...rest } = item;

        return { ...rest, totalPrice: totalAmount, _id: item._id?.toString() };
      }),
    };

    return { ok: true, data };
  } catch {
    return {
      ok: false,
      message: `Failed to fetch invoice with ID: ${invoiceId}`,
    };
  }
};
