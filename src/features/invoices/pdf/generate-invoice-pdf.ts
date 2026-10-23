import "server-only";

import type {
  InvoiceDocumentData,
  InvoiceDocumentNotes,
} from "@/features/invoices/types";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import { existsSync } from "node:fs";
import { join } from "node:path";
import PDFDocument from "pdfkit";

type PdfDoc = PDFKit.PDFDocument;

const GREEN = "#164b3a";
const DARK = "#253b36";
const MUTED = "#657770";
const PALE = "#f1f7f4";
const BORDER = "#d4e1dc";
const WHITE = "#ffffff";
const PAGE_MARGIN_X = 42;
const PAGE_MARGIN_TOP = 38;
const CONTENT_BOTTOM = 674;
const FOOTER_TOP = 690;
const LOGO_PATH = join(process.cwd(), "src", "assets", "logo.png");
const SEAL_PATH = join(process.cwd(), "public", "mm-fabrics-seal.png");
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
const COLUMN_RATIOS = [0.3, 0.24, 0.12, 0.12, 0.11, 0.11] as const;

function contentWidth(doc: PdfDoc): number {
  return doc.page.width - PAGE_MARGIN_X * 2;
}

function columnWidths(doc: PdfDoc): number[] {
  const width = contentWidth(doc);
  return COLUMN_RATIOS.map((ratio) => width * ratio);
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function stripLeadingNumber(term: string): string {
  return term.replace(/^\d+\.\s*/, "");
}

function addContentPage(doc: PdfDoc): void {
  doc.addPage({ size: "A4", margin: PAGE_MARGIN_X });
  doc.y = PAGE_MARGIN_TOP;
}

function ensureSpace(doc: PdfDoc, height: number): void {
  if (doc.y + height > CONTENT_BOTTOM) addContentPage(doc);
}

function drawHeader(doc: PdfDoc, data: InvoiceDocumentData): void {
  const x = PAGE_MARGIN_X;
  const width = contentWidth(doc);
  if (existsSync(LOGO_PATH))
    doc.image(LOGO_PATH, x, PAGE_MARGIN_TOP, { fit: [44, 44] });
  doc
    .font("Helvetica-Bold")
    .fontSize(19)
    .fillColor(GREEN)
    .text(data.seller.companyName, x + 54, PAGE_MARGIN_TOP + 2, { width: 220 });
  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(MUTED)
    .text("TEXTILE SOURCING & MANUFACTURING", x + 54, PAGE_MARGIN_TOP + 27, {
      width: 230,
      characterSpacing: 1.5,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(MUTED)
    .text("COMMERCIAL DOCUMENT", x + width - 210, PAGE_MARGIN_TOP + 1, {
      width: 210,
      align: "right",
      characterSpacing: 1.3,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(GREEN)
    .text("PROFORMA INVOICE", x + width - 300, PAGE_MARGIN_TOP + 16, {
      width: 300,
      align: "right",
      characterSpacing: 0.6,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(DARK)
    .text(`PI No. ${data.piNumber}`, x + width - 210, PAGE_MARGIN_TOP + 48, {
      width: 210,
      align: "right",
    });
  const ruleY = PAGE_MARGIN_TOP + 82;
  doc
    .moveTo(x, ruleY)
    .lineTo(x + width, ruleY)
    .lineWidth(3)
    .strokeColor(GREEN)
    .stroke();
  const sellerDetails: Array<[string, string]> = [
    ["Address", data.seller.address],
    ["Corporate Office", data.seller.corporateOffice],
    ["Contact", data.seller.contactNumber],
    ["Email", data.seller.email],
  ];
  sellerDetails.forEach(([label, value], index) => {
    const y = index === 0 ? ruleY + 15 : doc.y + 2;
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(DARK)
      .text(`${label}:`, x, y, { continued: true });
    doc
      .font("Helvetica")
      .fillColor(MUTED)
      .text(` ${value}`, { width });
  });
  const buyerY = doc.y + 20;
  const half = width * 0.58;
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(GREEN)
    .text("BILL TO / CONSIGNEE", x, buyerY, {
      width: half,
      characterSpacing: 1,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(DARK)
    .text(data.buyer.name || "—", x, buyerY + 16, { width: half });
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(MUTED)
    .text(data.buyer.address, x, doc.y + 3, { width: half });
  const metaX = x + half + 18;
  const metaWidth = width - half - 18;
  const rows: Array<[string, string]> = [
    ["Date", data.issueDateLabel || "—"],
    ["Currency", data.currency],
    ["Terms", "As agreed"],
  ];
  rows.forEach(([label, value], index) => {
    const y = buyerY + 10 + index * 19;
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(label, metaX, y, { width: metaWidth / 2 });
    doc
      .font("Helvetica-Bold")
      .fillColor(DARK)
      .text(value, metaX + metaWidth / 2, y, {
        width: metaWidth / 2,
        align: "right",
      });
  });
  doc.y = Math.max(doc.y, buyerY + 68) + 17;
}

function drawTableHeader(doc: PdfDoc, data: InvoiceDocumentData): void {
  const widths = columnWidths(doc);
  const x = PAGE_MARGIN_X;
  const y = doc.y;
  const height = 38;
  const labels = [
    "Description of goods",
    "Style",
    "Color",
    "Quantity\n(Yds)",
    `Unit price\n(${data.currency})`,
    `Total amount\n(${data.currency})`,
  ];
  doc.roundedRect(x, y, contentWidth(doc), height, 7).fill(GREEN);
  let cursor = x;
  labels.forEach((label, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(7.4)
      .fillColor(WHITE)
      .text(label, cursor + 6, y + 10, {
        width: widths[index] - 12,
        align: index >= 3 ? "right" : "left",
        lineGap: 1,
      });
    cursor += widths[index];
  });
  doc.y = y + height;
}

function drawTableRow(
  doc: PdfDoc,
  values: string[],
  options: { bold?: boolean; total?: boolean } = {},
): void {
  const widths = columnWidths(doc);
  const font = options.bold ? "Helvetica-Bold" : "Helvetica";
  doc.font(font).fontSize(7.5);
  const heights = values.map((value, index) =>
    doc.heightOfString(value || " ", { width: widths[index] - 12 }),
  );
  const height = Math.max(32, ...heights) + 12;
  ensureSpace(doc, height + 1);
  const x = PAGE_MARGIN_X;
  const y = doc.y;
  if (options.total) doc.rect(x, y, contentWidth(doc), height).fill(PALE);
  doc
    .moveTo(x, y + height)
    .lineTo(x + contentWidth(doc), y + height)
    .lineWidth(options.total ? 1.5 : 0.7)
    .strokeColor(options.total ? GREEN : BORDER)
    .stroke();
  let cursor = x;
  values.forEach((value, index) => {
    doc
      .font(font)
      .fontSize(7.5)
      .fillColor(options.total ? GREEN : DARK)
      .text(value || " ", cursor + 6, y + 7, {
        width: widths[index] - 12,
        align: index >= 3 ? "right" : "left",
        lineGap: 1,
      });
    cursor += widths[index];
  });
  doc.y = y + height;
}

function drawSayTotal(doc: PdfDoc, data: InvoiceDocumentData): void {
  const height = 36;
  ensureSpace(doc, height + 26);
  const y = doc.y + 14;
  doc.roundedRect(PAGE_MARGIN_X, y, contentWidth(doc), height, 6).fill(PALE);
  doc.rect(PAGE_MARGIN_X, y, 4, height).fill(GREEN);
  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(GREEN)
    .text("SAY TOTAL", PAGE_MARGIN_X + 13, y + 13, {
      width: 65,
      characterSpacing: 1,
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(8.3)
    .fillColor(DARK)
    .text(data.sayTotal, PAGE_MARGIN_X + 82, y + 12, {
      width: contentWidth(doc) - 95,
    });
  doc.y = y + height + 12;
}

function drawNumberedList(
  doc: PdfDoc,
  lines: string[],
  x: number,
  width: number,
): number {
  let y = doc.y;
  lines.forEach((line, index) => {
    const text = `${index + 1}. ${line}`;
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(MUTED)
      .text(text, x, y, { width, lineGap: 1, continued: false });
    y = doc.y + 2;
  });
  return y;
}

function numberedListHeight(doc: PdfDoc, lines: string[], width: number): number {
  doc.font("Helvetica").fontSize(7.5);
  return lines.reduce((height, line, index) => {
    const text = `${index + 1}. ${line}`;
    return height + Math.max(11, doc.heightOfString(text, { width: width - 12, lineGap: 1 }) + 1) + 2;
  }, 0);
}

function drawNotesAndTerms(doc: PdfDoc, data: InvoiceDocumentData): void {
  const notes = BANKING_NOTE_KEYS.flatMap((key) => {
    const field = INVOICE_NOTE_FIELDS.find(
      (candidate) => candidate.key === key,
    );
    const value = data.notes[key];
    return field && value?.trim() ? [`${field.label}: ${value}`] : [];
  });
  const gap = 25;
  const columnWidth = (contentWidth(doc) - gap) / 2;
  const terms = data.termsAndConditions.map(stripLeadingNumber);
  const listHeight = Math.max(
    numberedListHeight(doc, notes, columnWidth),
    numberedListHeight(doc, terms, columnWidth),
  );
  ensureSpace(doc, listHeight + 30);
  const top = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(GREEN)
    .text("Shipment & banking", PAGE_MARGIN_X, top, { width: columnWidth });
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(GREEN)
    .text("Terms & conditions", PAGE_MARGIN_X + columnWidth + gap, top, {
      width: columnWidth,
    });
  doc.y = top + 20;
  const leftY = drawNumberedList(doc, notes, PAGE_MARGIN_X, columnWidth);
  doc.y = top + 20;
  const rightY = drawNumberedList(doc, terms, PAGE_MARGIN_X + columnWidth + gap, columnWidth);
  doc.y = Math.max(leftY, rightY) + 8;
}

function drawLastPageFooter(doc: PdfDoc): void {
  const width = contentWidth(doc);
  const half = (width - 52) / 2;
  const leftX = PAGE_MARGIN_X;
  const rightX = PAGE_MARGIN_X + half + 52;
  const signatureY = FOOTER_TOP;
  [leftX, rightX].forEach((x) => {
    doc
      .moveTo(x, signatureY)
      .lineTo(x + half, signatureY)
      .dash(2, { space: 2 })
      .lineWidth(0.7)
      .strokeColor("#9eafa8")
      .stroke()
      .undash();
  });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(DARK)
    .text("Buyer authorized signature", leftX, signatureY + 8, {
      width: half,
      align: "center",
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(DARK)
    .text("For M.M FABRICS", rightX, signatureY + 8, {
      width: half,
      align: "center",
    });
  if (existsSync(SEAL_PATH))
    doc.image(SEAL_PATH, rightX + half / 2 - 22, signatureY - 50, {
      fit: [44, 42],
      align: "center",
      valign: "center",
    });
  const ruleY = doc.page.height - 80;
  doc
    .moveTo(PAGE_MARGIN_X, ruleY)
    .lineTo(PAGE_MARGIN_X + width, ruleY)
    .lineWidth(0.7)
    .strokeColor(BORDER)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(MUTED)
    .text("Thank you for your business.", PAGE_MARGIN_X, ruleY + 10, {
      width: width / 2,
    });
  doc.text(
    "Prepared by M.M Fabrics · Bangladesh",
    PAGE_MARGIN_X + width / 2,
    ruleY + 10,
    { width: width / 2, align: "right" },
  );
}

function renderInvoice(doc: PdfDoc, data: InvoiceDocumentData): void {
  drawHeader(doc, data);
  drawTableHeader(doc, data);
  data.lineItems.forEach((item) =>
    drawTableRow(doc, [
      item.description,
      item.style,
      item.color,
      new Intl.NumberFormat("en-US").format(item.quantity),
      money(item.unitPrice),
      money(item.totalAmount),
    ]),
  );
  drawTableRow(
    doc,
    [
      "",
      "",
      "Total:",
      new Intl.NumberFormat("en-US").format(data.totalQuantity),
      money(data.totalUnitPrice),
      money(data.totalAmount),
    ],
    { bold: true, total: true },
  );
  drawSayTotal(doc, data);
  drawNotesAndTerms(doc, data);
  drawLastPageFooter(doc);
}

export async function generateInvoicePdfBuffer(
  data: InvoiceDocumentData,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE_MARGIN_X,
      bufferPages: true,
      info: {
        Title: `Proforma Invoice ${data.piNumber}`,
        Author: "M.M FABRICS",
      },
    });
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (error: Error) => reject(error));
    renderInvoice(doc, data);
    doc.end();
  });
}
