"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";

type InvoiceFormValues = CreateInvoiceInput;

interface InvoicePreviewProps {
  zoom: "fit" | 75 | 100;
}

const MM = 96 / 25.4; // pixels per mm at 96 dpi
const A4_WIDTH_PX = 210 * MM;
const A4_HEIGHT_PX = 297 * MM;

export function InvoicePreview({ zoom }: InvoicePreviewProps) {
  const { getValues } = useFormContext<InvoiceFormValues>();
  const formValues = getValues();
  const [overflowing, setOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { lineItems, totalAmount } = calculateInvoiceTotals(
    formValues.lineItems,
  );
  const currency = formValues.currency ?? "USD";
  const sayTotal = numberToWords(totalAmount, currency);

  const checkOverflow = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 4);
  }, []);

  useEffect(checkOverflow, [checkOverflow, lineItems.length, formValues.notes]);

  const scale = zoom === 100 ? 1 : zoom === 75 ? 0.75 : 0.5;

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/40 rounded-lg border border-border"
      style={{
        width: zoom === 100 ? "100%" : A4_WIDTH_PX * scale,
        height: zoom === 100 ? "auto" : A4_HEIGHT_PX * scale,
        transformOrigin: "top left",
        transform: `scale(${scale})`,
      } as React.CSSProperties}
    >
      <div
        ref={contentRef}
        className="w-[210mm] min-h-[297mm] bg-paper border border-border p-8 text-ink overflow-hidden"
        style={{ ...(zoom === 100 ? { width: "100%", height: "auto" } : {}) } as React.CSSProperties}
      >
        {/* Company name (serif display) */}
        <div className="font-serif text-xl font-bold tracking-tight mb-1">
          {formValues.seller.companyName || "M.M FABRICS"}
        </div>
        {/* Seller contact details */}
        <div className="text-xs text-muted-foreground mb-6 space-y-1">
          <div>{formValues.seller.address}</div>
          <div>
            {formValues.seller.corporateOffice} •
            {formValues.seller.contactNumber} •
            {formValues.seller.email}
          </div>
        </div>
        {/* Blue rule */}
        <div className="h-1 bg-primary mb-4" />
        {/* Title */}
        <div className="font-serif text-2xl font-bold text-primary tracking-wider mb-6">
          PROFORMA INVOICE
        </div>
        {/* Buyer and metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div className="space-y-1">
            <div className="font-semibold">Buyer / Consignee</div>
            <div>{formValues.buyer.name}</div>
            <div>{formValues.buyer.address}</div>
            <div>{formValues.buyer.destinationCountry}</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="font-semibold">Invoice No.</div>
            <div>{formValues.invoiceNumber}</div>
            <div className="font-semibold">Issue date</div>
            <div>{new Date(formValues.issueDate).toLocaleDateString()}</div>
            <div className="font-semibold">Currency</div>
            <div>{currency}</div>
          </div>
        </div>
        <Separator />
        {/* Line-item table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse border border-border">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-2 py-1 text-left">Description</th>
                <th className="px-2 py-1 text-left">Style</th>
                <th className="px-2 py-1 text-left">Color</th>
                <th className="px-2 py-1 text-right">Qty</th>
                <th className="px-2 py-1 text-right">Unit</th>
                <th className="px-2 py-1 text-right">Unit price</th>
                <th className="px-2 py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {lineItems.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-2 py-1">{item.description}</td>
                  <td className="px-2 py-1">{item.style}</td>
                  <td className="px-2 py-1">{item.color}</td>
                  <td className="px-2 py-1 text-right">
                    {String(item.quantity ?? 0)}
                  </td>
                  <td className="px-2 py-1 text-right">{item.unit}</td>
                  <td className="px-2 py-1 text-right">
                    {`${currency} ${Number(item.unitPrice ?? 0).toFixed(2)}`}
                  </td>
                  <td className="px-2 py-1 text-right font-medium">
                    {`${currency} ${Number(item.totalAmount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totals */}
        <div className="flex justify-end mt-2">
          <div className="text-right font-serif font-medium text-sm border-l-2 border-primary pl-2">
            <div>
              Total {`${currency} ${totalAmount.toFixed(2)}`}
            </div>
          </div>
        </div>
        {/* Say-total callout */}
        {sayTotal && (
          <div className="mt-6 rounded-lg border border-accent bg-accent/50 p-3 text-xs">
            <span className="font-semibold text-ink">Say total: </span>
            <span className="font-serif">{sayTotal}.</span>
          </div>
        )}
        {/* Notes */}
        <div className="mt-6 space-y-2 text-xs">
          <div className="font-semibold text-ink">Notes</div>
          {[
            { label: "Say total", value: formValues.notes.sayTotal },
            { label: "Goods delivery destination", value: formValues.notes.goodsDeliveryDestination },
            { label: "Goods origin", value: formValues.notes.goodsOrigin },
            { label: "Advising bank", value: formValues.notes.advisingBank },
            { label: "Allowance", value: formValues.notes.allowance },
            { label: "Packing", value: formValues.notes.packing },
            { label: "Shipment date", value: formValues.notes.shipmentDate },
            { label: "Payment", value: formValues.notes.payment },
            { label: "Partial shipment", value: formValues.notes.partialShipment },
            { label: "PI validity", value: formValues.notes.piValidity },
          ]
            .filter((n) => n.value)
            .map((note, i) => (
              <div key={i} className="flex">
                <span className="shrink-0 text-muted-foreground">{i + 1}.</span>
                <span className="ml-1">{note.label}: {note.value}</span>
              </div>
            ))}
        </div>
        {/* Terms and conditions */}
        {formValues.termsAndConditions.length > 0 && (
          <div className="mt-6 space-y-1 text-xs">
            <div className="font-semibold text-ink">Terms and conditions</div>
            {formValues.termsAndConditions.map((term, i) => (
              <div key={i} className="flex">
                <span className="shrink-0 text-muted-foreground">{i + 1}.</span>
                <span className="ml-1">{term}</span>
              </div>
            ))}
          </div>
        )}
        {/* Signatures */}
        <div className="mt-8 flex justify-between text-xs">
          <div className="w-1/3 border-t border-border pt-2">
            <div className="text-muted-foreground">Buyer authorized signature</div>
            {formValues.signatures.buyerLabel && (
              <div className="font-medium">{formValues.signatures.buyerLabel}</div>
            )}
          </div>
          <div className="w-1/3 border-t border-border pt-2">
            <div className="text-muted-foreground">Seller signature</div>
            {formValues.signatures.sellerLabel && (
              <div className="font-medium">{formValues.signatures.sellerLabel}</div>
            )}
          </div>
        </div>
        {/* Footer / page count */}
        <div className="mt-8 flex justify-between text-[10px] text-muted-foreground border-t border-border pt-2">
          <span>M.M FABRICS — Proforma Invoice</span>
          <span>Page 1 of 1</span>
        </div>
        {overflowing && (
          <div className="absolute bottom-2 left-2 z-10 rounded bg-destructive/90 px-2 py-1 text-xs text-destructive">
            Content may exceed one page
          </div>
        )}
      </div>
    </div>
  );
}
