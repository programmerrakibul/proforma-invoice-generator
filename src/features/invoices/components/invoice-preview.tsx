import Image from "next/image";
import logo from "@/assets/logo.png";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceDocumentData, InvoiceDocumentNotes } from "@/features/invoices/types";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import { formatInvoiceMoney } from "@/features/invoices/utils/format-invoice-money";

interface InvoicePreviewProps {
  data: InvoiceDocumentData;
}

function stripLeadingNumber(term: string): string {
  return term.replace(/^\d+\.\s*/, "");
}

const BANKING_NOTE_KEYS: Array<keyof InvoiceDocumentNotes> = [
  "goodsDeliveryDestination",
  "goodsOrigin",
  "advisingBank",
  "allowance",
  "packing",
  "shipmentDate",
  "payment",
  "partialShipment",
  "piValidity",
];

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const bankingNotes = BANKING_NOTE_KEYS.flatMap((key) => {
    const field = INVOICE_NOTE_FIELDS.find((candidate) => candidate.key === key);
    const value = data.notes[key];
    return field && value?.trim() ? [{ ...field, value }] : [];
  });

  return (
    <article className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white p-[25.4mm] font-sans text-[#253b36] shadow-lg print:min-h-[297mm] print:shadow-none">
      <header className="flex items-start justify-between gap-6 pb-5">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="M.M Fabrics logo" width={58} height={58} className="size-[18mm] rounded-xl object-contain" priority />
          <div>
            <h2 className="text-[20pt] font-extrabold tracking-[0.08em] text-[#164b3a]">{data.seller.companyName}</h2>
            <p className="mt-0.5 text-[7.5pt] font-bold tracking-[0.2em] text-[#64766f]">TEXTILE SOURCING &amp; MANUFACTURING</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[7.5pt] font-bold tracking-[0.2em] text-[#64766f]">COMMERCIAL DOCUMENT</p>
          <h1 className="mt-1 text-[19pt] font-extrabold tracking-[0.06em] text-[#164b3a]">PROFORMA INVOICE</h1>
          <p className="mt-1 text-[9pt] font-bold text-[#253b36]">PI No. {data.piNumber}</p>
        </div>
      </header>

      <Separator className="h-[1.2mm] rounded-full bg-[#164b3a]" />
      <section className="flex flex-col gap-1.5 py-5 text-[8pt] leading-relaxed text-[#657770]">
        <p><strong className="text-[#253b36]">Address:</strong> {data.seller.address}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <p><strong className="text-[#253b36]">Corporate Office:</strong> {data.seller.corporateOffice}</p>
          <p><strong className="text-[#253b36]">Contact:</strong> {data.seller.contactNumber}</p>
          <p><strong className="text-[#253b36]">Email:</strong> {data.seller.email}</p>
        </div>
      </section>

      <section className="mb-7 grid grid-cols-[1.35fr_0.65fr] gap-8 text-[8.5pt]">
        <div>
          <p className="mb-2 font-extrabold tracking-[0.15em] text-[#164b3a]">BILL TO / CONSIGNEE</p>
          <p className="text-[13pt] font-bold text-[#253b36]">{data.buyer.name || "—"}</p>
          <p className="mt-1 text-[#657770]">{data.buyer.address}</p>
        </div>
        <dl className="flex flex-col gap-2 pt-3 text-[#657770]">
          <div className="flex justify-between gap-3"><dt>Date</dt><dd className="font-bold text-[#253b36]">{data.issueDateLabel || "—"}</dd></div>
          <div className="flex justify-between gap-3"><dt>Currency</dt><dd className="font-bold text-[#253b36]">{data.currency}</dd></div>
          <div className="flex justify-between gap-3"><dt>Terms</dt><dd className="font-bold text-[#253b36]">As agreed</dd></div>
        </dl>
      </section>

      <div className="mb-5 overflow-hidden rounded-[3mm] border border-[#d4e1dc]">
        <Table className="text-[8pt]">
          <TableHeader className="bg-[#164b3a] hover:bg-[#164b3a]">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="w-[30%] whitespace-normal px-3 py-3 font-bold text-white">Description of goods</TableHead>
              <TableHead className="w-[24%] whitespace-normal px-3 py-3 font-bold text-white">Style</TableHead>
              <TableHead className="w-[12%] whitespace-normal px-3 py-3 font-bold text-white">Color</TableHead>
              <TableHead className="w-[12%] whitespace-normal px-2 py-3 text-right font-bold text-white">Quantity<br />(Yds)</TableHead>
              <TableHead className="w-[11%] whitespace-normal px-2 py-3 text-right font-bold text-white">Unit price<br />({data.currency})</TableHead>
              <TableHead className="w-[13%] whitespace-normal px-2 py-3 text-right font-bold text-white">Total amount<br />({data.currency})</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.lineItems.map((item, index) => (
              <TableRow key={`${item.description}-${index}`} className="border-[#d4e1dc] hover:bg-transparent">
                <TableCell className="whitespace-pre-line px-3 py-3 align-top font-medium text-[#253b36]">{item.description}</TableCell>
                <TableCell className="whitespace-pre-line px-3 py-3 align-top text-[#253b36]">{item.style}</TableCell>
                <TableCell className="px-3 py-3 align-top text-[#253b36]">{item.color}</TableCell>
                <TableCell className="px-2 py-3 text-right align-top text-[#253b36]">{new Intl.NumberFormat("en-US").format(item.quantity)}</TableCell>
                <TableCell className="px-2 py-3 text-right align-top text-[#253b36]">{formatInvoiceMoney(item.unitPrice, data.currency)}</TableCell>
                <TableCell className="px-2 py-3 text-right align-top text-[#253b36]">{formatInvoiceMoney(item.totalAmount, data.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-t-2 border-[#164b3a] bg-[#f1f7f4] text-[#164b3a]">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="px-3 py-3 text-right font-bold">Total:</TableCell>
              <TableCell className="px-2 py-3 text-right font-bold">{new Intl.NumberFormat("en-US").format(data.totalQuantity)}</TableCell>
              <TableCell className="px-2 py-3 text-right font-bold">{formatInvoiceMoney(data.totalUnitPrice, data.currency)}</TableCell>
              <TableCell className="px-2 py-3 text-right font-bold">{formatInvoiceMoney(data.totalAmount, data.currency)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="mb-7 flex items-center gap-4 rounded-r-[3mm] border-l-[2mm] border-[#164b3a] bg-[#f1f7f4] px-4 py-3 text-[8.5pt]">
        <span className="shrink-0 text-[7pt] font-extrabold tracking-[0.14em] text-[#164b3a]">SAY TOTAL</span>
        <p className="font-bold text-[#253b36]">{data.sayTotal}</p>
      </div>

      <section className="mb-6 grid grid-cols-2 gap-10 text-[8pt] leading-relaxed">
        <div>
          <h2 className="mb-3 text-[11pt] font-extrabold tracking-wide text-[#164b3a]">Shipment &amp; banking</h2>
          <ol className="flex list-decimal flex-col gap-0.5 pl-5 marker:font-bold marker:text-[#164b3a]">
            {bankingNotes.map((note) => (
              <li key={note.key} className="text-[#657770]"><strong className="text-[#253b36]">{note.label}:</strong> {note.value}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="mb-3 text-[11pt] font-extrabold tracking-wide text-[#164b3a]">Terms &amp; conditions</h2>
          <ol className="flex list-decimal flex-col gap-0.5 pl-5 marker:font-bold marker:text-[#164b3a]">
            {data.termsAndConditions.map((term, index) => (
              <li key={`${term}-${index}`} className="text-[#657770]">{stripLeadingNumber(term)}</li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mt-auto pt-3">
        <div className="mb-8 grid grid-cols-2 gap-12 text-center text-[8pt] font-bold text-[#253b36]">
          <div>
            <div className="mb-1 flex h-[16mm] items-end justify-center" aria-hidden="true" />
            <Separator className="mb-2 border-t border-dashed border-[#9eafa8] bg-transparent" />
            <p>Buyer authorized signature</p>
          </div>
          <div>
            <div className="mb-1 flex h-[16mm] items-end justify-center">
              <Image src="/mm-fabrics-seal.png" alt="M.M FABRICS company seal" width={100} height={80} className="h-[16mm] w-[22mm] object-contain" />
            </div>
            <Separator className="mb-2 border-t border-dashed border-[#9eafa8] bg-transparent" />
            <p>For M.M FABRICS</p>
          </div>
        </div>
        <Separator className="mb-3 bg-[#d4e1dc]" />
        <div className="flex justify-between text-[7pt] text-[#657770]"><p>Thank you for your business.</p><p>Prepared by M.M Fabrics · Bangladesh</p></div>
      </footer>
    </article>
  );
}
