import type { InvoiceDocumentData } from "@/features/invoices/types";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import { formatInvoiceMoney } from "@/features/invoices/utils/format-invoice-money";
import Image from "next/image";

interface InvoicePreviewProps {
  data: InvoiceDocumentData;
}

function stripLeadingNumber(term: string): string {
  return term.replace(/^\d+\.\s*/, "");
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const notes = INVOICE_NOTE_FIELDS.filter((field) => {
    const value = data.notes[field.key];
    return Boolean(value && value.trim().length > 0);
  });

  return (
    <article className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white px-[14mm] py-[12mm] text-[#1a1a1a] shadow-lg">
      <header className="mb-3 text-center">
        <h2 className="text-[22px] font-bold leading-tight text-primary">
          {data.seller.companyName}
        </h2>
        <p className="mt-1 text-[7.5pt] leading-snug">
          Address: {data.seller.address}
        </p>
        <p className="text-[7.5pt] leading-snug">
          Corporate Office: {data.seller.corporateOffice}
        </p>
        <p className="text-[7.5pt] leading-snug">
          Contact Number: {data.seller.contactNumber} | Email:{" "}
          {data.seller.email}
        </p>
      </header>

      <div className="mb-3 h-0.5 w-full bg-primary" />

      <h3 className="mb-4 text-center text-[18px] font-bold uppercase tracking-wide text-primary">
        Proforma Invoice
      </h3>

      <div className="mb-4 flex items-center justify-between gap-6 text-[8.5pt]">
        <div>
          <p className="font-bold">Buyer / Consignee</p>
          <p>{data.buyer.name || "—"}</p>
          {data.buyer.address ? <p>{data.buyer.address}</p> : null}
        </div>
        <div>
          <p className="flex gap-1.5 items-center">
            <span className="font-bold">PI No.:</span>
            <span>{data.piNumber}</span>
          </p>
          <p className="flex gap-1.5 items-center">
            <span className="font-bold">Date:</span>
            <span>{data.issueDateLabel || "—"}</span>
          </p>
        </div>
      </div>

      <table className="mb-4 w-full border-collapse border border-[#1a1a1a] text-[8pt]">
        <thead>
          <tr className="bg-primary/80 text-white">
            <th className="w-[30%] border border-primary px-1.5 py-1 text-left font-bold">
              Description of Goods
            </th>
            <th className="w-[14%] border border-primary px-1.5 py-1 text-left font-bold">
              Style
            </th>
            <th className="w-[14%] border border-primary px-1.5 py-1 text-left font-bold">
              Color
            </th>
            <th className="w-[14%] border border-primary px-1.5 py-1 text-right font-bold">
              Quantity (Yds)
            </th>
            <th className="w-[14%] border border-primary px-1.5 py-1 text-right font-bold">
              Unit Price ({data.currency})
            </th>
            <th className="w-[14%] border border-primary px-1.5 py-1 text-right font-bold">
              Total Amount ({data.currency})
            </th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, index) => (
            <tr key={`${item.description}-${index}`}>
              <td className="border border-primary px-1.5 py-1">
                {item.description}
              </td>
              <td className="border border-primary px-1.5 py-1">
                {item.style}
              </td>
              <td className="border border-primary px-1.5 py-1 text-center">
                {item.color}
              </td>
              <td className="border border-primary px-1.5 py-1 text-center">
                {new Intl.NumberFormat("en-ES").format(item.quantity)}
              </td>
              <td className="border border-primary px-1.5 py-1 text-center">
                {formatInvoiceMoney(item.unitPrice, data.currency)}
              </td>
              <td className="border border-primary px-1.5 py-1 text-center">
                {formatInvoiceMoney(item.totalAmount, data.currency)}
              </td>
            </tr>
          ))}
          <tr className="text-center font-bold text-primary/80">
            <td colSpan={3} className="border border-primary">
              Total
            </td>
            <td className="border border-primary px-1.5 py-1">
              {new Intl.NumberFormat("en-US").format(data.totalQuantity)}
            </td>
            <td className="border border-primary px-1.5 py-1">
              {formatInvoiceMoney(data.totalUnitPrice, data.currency)}
            </td>
            <td className="border border-primary px-1.5 py-1">
              {formatInvoiceMoney(data.totalAmount, data.currency)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-4 rounded border border-[#d97706] bg-[#fef3c7] px-2.5 py-2 text-[8pt]">
        <p className="font-bold">Say total:</p>
        <p>{data.sayTotal}.</p>
      </div>

      {notes.length > 0 ? (
        <section className="mb-4 text-[8pt]">
          <p className="mb-1 font-bold">Notes</p>
          {notes.map((note, index) => (
            <p key={note.key}>
              {index + 1}. {note.label}: {data.notes[note.key]}
            </p>
          ))}
        </section>
      ) : null}

      <section className="mb-8 text-[8pt]">
        <p className="mb-1 font-bold">Terms & Conditions:</p>
        {data.termsAndConditions.map((term, index) => (
          <p key={`${term}-${index}`}>
            {index + 1}. {stripLeadingNumber(term)}
          </p>
        ))}
      </section>

      <footer className="mt-auto grid grid-cols-2 gap-16 pt-8 text-[8pt] text-center">
        <div>
          <div className="mb-1 h-14 border-b border-dotted border-[#1a1a1a]" />
          <p>Buyer Authorized Signature</p>
        </div>
        <div>
          <div className="relative mb-1 h-14 border-b border-dotted border-[#1a1a1a]">
            <Image
              src="/mm-fabrics-seal.png"
              alt="M.M FABRICS company seal"
              width={140}
              height={100}
              className="absolute bottom-1 left-1/2 h-12 w-20 -translate-x-1/2 object-contain"
            />
          </div>
          <p>For M.M FABRICS</p>
        </div>
      </footer>
    </article>
  );
}
