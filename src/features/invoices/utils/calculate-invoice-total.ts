import { InvoiceDocumentInput } from "./build-invoice-document";
import { roundToTwo } from "./round-to-two";

interface CalculateInvoiceTotalsReturnProps {
  lineItems: InvoiceDocumentInput["lineItems"];
  totalQuantity: number;
  totalUnitPrice: number;
  totalAmount: number;
}

export function calculateInvoiceTotals(
  lineItems: InvoiceDocumentInput["lineItems"],
): CalculateInvoiceTotalsReturnProps {
  let grandTotalQuantity = 0;
  let grandTotalUnitPrice = 0;
  let grandTotalAmount = 0;

  const updatedItems = (lineItems || []).map((item) => {
    const updatedSubItems = (item.fabricLineItems || []).map((subItem) => {
      const quantity = Number.isFinite(subItem.quantity)
        ? Math.max(0, subItem.quantity || 0)
        : 0;
      const unitPrice = Number.isFinite(subItem.unitPrice)
        ? roundToTwo(Math.max(0, subItem.unitPrice || 0))
        : 0;
      const totalAmount = roundToTwo(quantity * unitPrice);

      grandTotalQuantity += quantity;
      grandTotalUnitPrice += unitPrice;
      grandTotalAmount += totalAmount;

      return {
        ...subItem,
        totalAmount,
        unitPrice,
        quantity,
      };
    });

    return {
      ...item,
      fabricLineItems: updatedSubItems,
    };
  });

  return {
    lineItems: updatedItems,
    totalQuantity: grandTotalQuantity,
    totalUnitPrice: grandTotalUnitPrice,
    totalAmount: grandTotalAmount,
  };
}
