import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import type { InvoiceDocumentData } from "@/features/invoices/types";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import PDFDocument from "pdfkit";

type PdfDoc = PDFKit.PDFDocument;

const NAVY = "#1a2e6a";
const BLUE = "#2563eb";
const BLACK = "#1a1a1a";
const AMBER_BG = "#fef3c7";
const AMBER_BORDER = "#d97706";
const WHITE = "#ffffff";

const PAGE_MARGIN_X = 50;
const PAGE_MARGIN_TOP = 40;
const PAGE_MARGIN_BOTTOM = 52;
const TABLE_FONT_SIZE = 8;
const MIN_EMPTY_ROWS = 2;
const SEAL_PATH = join(process.cwd(), "public", "mm-fabrics-seal.png");

function formatInvoiceNumber(value: number): string {
  return new Intl.NumberFormat("en-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const COLUMN_RATIOS = [0.3, 0.14, 0.14, 0.14, 0.14, 0.14] as const;

function contentWidth(doc: PdfDoc): number {
  return doc.page.width - PAGE_MARGIN_X * 2;
}

function columnWidths(doc: PdfDoc): number[] {
  const width = contentWidth(doc);
  return COLUMN_RATIOS.map((ratio) => width * ratio);
}

function pageBottom(doc: PdfDoc): number {
  return doc.page.height - PAGE_MARGIN_BOTTOM;
}

function ensureSpace(doc: PdfDoc, needed: number): void {
  if (doc.y + needed <= pageBottom(doc)) {
    return;
  }

  doc.addPage();
  doc.y = PAGE_MARGIN_TOP;
}

function stripLeadingNumber(term: string): string {
  return term.replace(/^\d+\.\s*/, "");
}

function drawCenteredText(
  doc: PdfDoc,
  text: string,
  y: number,
  options: { fontSize: number; color: string; bold?: boolean },
): number {
  doc
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.fontSize)
    .fillColor(options.color)
    .text(text, PAGE_MARGIN_X, y, {
      width: contentWidth(doc),
      align: "center",
    });

  return doc.y;
}

function drawTableHeader(doc: PdfDoc, data: InvoiceDocumentData): void {
  const widths = columnWidths(doc);
  const x = PAGE_MARGIN_X;
  const y = doc.y;
  const height = 22;
  const labels = [
    "Description of Goods",
    "Style",
    "Color",
    "Quantity (Yds)",
    `Unit Price (${data.currency})`,
    `Total Amount (${data.currency})`,
  ];

  doc.rect(x, y, contentWidth(doc), height).fill(NAVY);

  let cursorX = x;
  labels.forEach((label, index) => {
    const align = index >= 3 ? "right" : "left";
    doc
      .font("Helvetica-Bold")
      .fontSize(TABLE_FONT_SIZE)
      .fillColor(WHITE)
      .text(label, cursorX + 3, y + 6, {
        width: widths[index] - 6,
        align,
      });
    cursorX += widths[index];
  });

  doc
    .lineWidth(0.5)
    .strokeColor(BLACK)
    .rect(x, y, contentWidth(doc), height)
    .stroke();

  doc.y = y + height;
}

function drawCellBorders(
  doc: PdfDoc,
  x: number,
  y: number,
  widths: number[],
  height: number,
): void {
  let cursorX = x;
  widths.forEach((width) => {
    doc
      .lineWidth(0.5)
      .strokeColor(BLACK)
      .rect(cursorX, y, width, height)
      .stroke();
    cursorX += width;
  });
}

function drawTableRow(
  doc: PdfDoc,
  values: string[],
  options: { bold?: boolean; alignRightFrom?: number } = {},
): void {
  const widths = columnWidths(doc);
  const font = options.bold ? "Helvetica-Bold" : "Helvetica";
  doc.font(font).fontSize(TABLE_FONT_SIZE);

  const textHeights = values.map((value, index) =>
    doc.heightOfString(value.length > 0 ? value : " ", {
      width: widths[index] - 6,
    }),
  );
  const height = Math.max(18, ...textHeights) + 8;

  ensureSpace(doc, height);

  const x = PAGE_MARGIN_X;
  const y = doc.y;
  const alignRightFrom = options.alignRightFrom ?? 3;

  let cursorX = x;
  values.forEach((value, index) => {
    const align = index >= alignRightFrom ? "right" : "left";
    doc
      .font(font)
      .fontSize(TABLE_FONT_SIZE)
      .fillColor(BLACK)
      .text(value, cursorX + 3, y + 4, {
        width: widths[index] - 6,
        align,
      });
    cursorX += widths[index];
  });

  drawCellBorders(doc, x, y, widths, height);
  doc.y = y + height;
}

function drawHeader(doc: PdfDoc, data: InvoiceDocumentData): void {
  let y = PAGE_MARGIN_TOP;
  y = drawCenteredText(doc, data.seller.companyName, y, {
    fontSize: 22,
    color: NAVY,
    bold: true,
  });
  y = drawCenteredText(doc, `Address: ${data.seller.address}`, y + 2, {
    fontSize: 7.5,
    color: BLACK,
  });
  y = drawCenteredText(
    doc,
    `Corporate Office: ${data.seller.corporateOffice}`,
    y,
    { fontSize: 7.5, color: BLACK },
  );
  y = drawCenteredText(
    doc,
    `Contact Number: ${data.seller.contactNumber} | Email: ${data.seller.email}`,
    y,
    { fontSize: 7.5, color: BLACK },
  );

  doc
    .rect(PAGE_MARGIN_X, y + 6, contentWidth(doc), 2)
    .fill(BLUE);

  drawCenteredText(doc, "PROFORMA INVOICE", y + 16, {
    fontSize: 18,
    color: BLUE,
    bold: true,
  });

  const metaY = doc.y + 8;
  const columnWidth = contentWidth(doc) / 2;

  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(BLACK);
  doc.text("Buyer / Consignee", PAGE_MARGIN_X, metaY, { width: columnWidth });
  doc.font("Helvetica").fontSize(8.5);
  doc.text(data.buyer.name || "—", PAGE_MARGIN_X, doc.y, { width: columnWidth });
  if (data.buyer.address) {
    doc.text(data.buyer.address, PAGE_MARGIN_X, doc.y, { width: columnWidth });
  }
  if (data.buyer.destinationCountry) {
    doc.text(data.buyer.destinationCountry, PAGE_MARGIN_X, doc.y, {
      width: columnWidth,
    });
  }

  const rightX = PAGE_MARGIN_X + columnWidth;
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(BLACK);
  doc.text("PI No.", rightX, metaY, { width: columnWidth });
  doc.font("Helvetica").text(data.piNumber, rightX, doc.y, {
    width: columnWidth,
  });
  doc.font("Helvetica-Bold").text("Date", rightX, doc.y + 6, {
    width: columnWidth,
  });
  doc.font("Helvetica").text(data.issueDateLabel, rightX, doc.y, {
    width: columnWidth,
  });

  doc.y = Math.max(doc.y, metaY + 52) + 8;
}

function drawNotesAndTerms(doc: PdfDoc, data: InvoiceDocumentData): void {
  const notes = INVOICE_NOTE_FIELDS.filter((field) => {
    const value = data.notes[field.key];
    return Boolean(value && value.trim().length > 0);
  });

  if (notes.length > 0) {
    ensureSpace(doc, 28);
    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
    doc.text("Notes", PAGE_MARGIN_X, doc.y, { width: contentWidth(doc) });
    notes.forEach((note, index) => {
      const value = data.notes[note.key] ?? "";
      ensureSpace(doc, 14);
      doc.font("Helvetica").fontSize(8).fillColor(BLACK);
      doc.text(
        `${index + 1}. ${note.label}: ${value}`,
        PAGE_MARGIN_X,
        doc.y,
        { width: contentWidth(doc) },
      );
    });
  }

  ensureSpace(doc, 28);
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Terms & Conditions:", PAGE_MARGIN_X, doc.y, {
    width: contentWidth(doc),
  });

  data.termsAndConditions.forEach((term, index) => {
    ensureSpace(doc, 14);
    doc.font("Helvetica").fontSize(8).fillColor(BLACK);
    doc.text(
      `${index + 1}. ${stripLeadingNumber(term)}`,
      PAGE_MARGIN_X,
      doc.y,
      { width: contentWidth(doc) },
    );
  });
}

function drawSignatures(doc: PdfDoc): void {
  ensureSpace(doc, 72);
  doc.moveDown(1.4);
  const y = doc.y;
  const blockWidth = contentWidth(doc) / 3;

  doc
    .moveTo(PAGE_MARGIN_X, y)
    .lineTo(PAGE_MARGIN_X + blockWidth, y)
    .strokeColor(BLACK)
    .lineWidth(1)
    .stroke();
  doc.font("Helvetica").fontSize(8).fillColor(BLACK);
  doc.text("Buyer Authorized Signature", PAGE_MARGIN_X, y + 6, {
    width: blockWidth,
  });

  const sellerX = PAGE_MARGIN_X + contentWidth(doc) - blockWidth;
  if (existsSync(SEAL_PATH)) {
    doc.image(SEAL_PATH, sellerX + blockWidth / 2 - 30, y - 38, {
      fit: [60, 34],
      align: "center",
      valign: "center",
    });
  }
  doc
    .moveTo(sellerX, y)
    .lineTo(sellerX + blockWidth, y)
    .strokeColor(BLACK)
    .lineWidth(1)
    .stroke();
  doc.text("For M.M FABRICS", sellerX, y + 6, { width: blockWidth });

  doc.y = y + 48;
}

function renderInvoice(doc: PdfDoc, data: InvoiceDocumentData): void {
  drawHeader(doc, data);
  drawTableHeader(doc, data);

  data.lineItems.forEach((item) => {
    drawTableRow(doc, [
      item.description,
      item.style,
      item.color,
      new Intl.NumberFormat("en-ES").format(Number(item.quantity)),
      formatInvoiceNumber(Number(item.unitPrice)),
      formatInvoiceNumber(Number(item.totalAmount)),
    ]);
  });

  const emptyRowCount = Math.max(MIN_EMPTY_ROWS, 0);
  for (let index = 0; index < emptyRowCount; index += 1) {
    drawTableRow(doc, ["", "", "", "", "", ""]);
  }

  drawTableRow(
    doc,
    [
      "",
      "",
      "",
      new Intl.NumberFormat("en-ES").format(data.totalQuantity),
      formatInvoiceNumber(data.totalUnitPrice),
      formatInvoiceNumber(data.totalAmount),
    ],
    { bold: true },
  );

  ensureSpace(doc, 48);
  const boxY = doc.y + 12;
  const boxHeight = 36;
  doc
    .roundedRect(PAGE_MARGIN_X, boxY, contentWidth(doc), boxHeight, 4)
    .fillAndStroke(AMBER_BG, AMBER_BORDER);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Say total:", PAGE_MARGIN_X + 10, boxY + 8, {
    width: contentWidth(doc) - 20,
  });
  doc.font("Helvetica").text(`${data.sayTotal}.`, PAGE_MARGIN_X + 10, doc.y, {
    width: contentWidth(doc) - 20,
  });
  doc.y = boxY + boxHeight + 8;

  drawNotesAndTerms(doc, data);
  drawSignatures(doc);
}

export async function generateInvoicePdfBuffer(
  data: InvoiceDocumentData,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
      info: {
        Title: `Proforma Invoice ${data.piNumber}`,
        Author: "M.M FABRICS",
      },
    });

    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array) => {
      chunks.push(chunk);
    });
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on("error", (error: Error) => {
      reject(error);
    });

    renderInvoice(doc, data);
    doc.end();
  });
}
