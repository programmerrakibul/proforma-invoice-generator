"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link as PDFLink,
} from "@react-pdf/renderer";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontSize: 9,
  },
  companyName: {
    fontFamily: "sans",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  sellerContact: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 12,
  },
  blueRule: {
    height: 1,
    backgroundColor: "#2563eb",
    marginBottom: 12,
    width: "100%",
  },
  title: {
    fontFamily: "sans",
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#1a1a1a",
  },
  metaValue: {
    fontSize: 8,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderWidth: 1,
    borderColor: "#666666",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  tableHeaderCell: {
    padding: 4,
    fontSize: 7,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#666666",
    width: "14.28%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
    padding: 4,
  },
  tableCell: {
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#666666",
    width: "14.28%",
  },
  tableCellRight: {
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#666666",
    width: "14.28%",
    textAlign: "right",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalsLabel: {
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "sans",
    textAlign: "right",
  },
  sayTotal: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#d97706",
    borderRadius: 4,
  },
  sayTotalLabel: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#1a1a1a",
  },
  sayTotalValue: {
    fontFamily: "sans",
    fontSize: 8,
    color: "#1a1a1a",
  },
  notesSection: {
    marginTop: 16,
  },
  notesLabel: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  notesItem: {
    fontSize: 8,
    color: "#1a1a1a",
    marginBottom: 2,
    flexDirection: "row",
  },
  notesItemNumber: {
    color: "#666666",
    width: 12,
  },
  termsSection: {
    marginTop: 16,
  },
  termsLabel: {
    fontWeight: "bold",
    fontSize: 8,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  termsItem: {
    fontSize: 8,
    color: "#1a1a1a",
    marginBottom: 2,
    flexDirection: "row",
  },
  termsItemNumber: {
    color: "#666666",
    width: 12,
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  signatureBlock: {
    width: "33%",
    borderTopWidth: 1,
    borderColor: "#666666",
    paddingTop: 8,
    fontSize: 8,
    color: "#666666",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#666666",
    borderTopWidth: 1,
    borderColor: "#666666",
    paddingTop: 8,
  },
});

type InvoicePdfDocumentProps = {
  piNumber?: string;
  issueDate?: string;
  currency?: string;
  seller?: {
    companyName?: string;
    address?: string;
    corporateOffice?: string;
    contactNumber?: string;
    email?: string;
  };
  buyer?: {
    name?: string;
    address?: string;
    destinationCountry?: string;
  };
  lineItems?: Array<{
    description?: string;
    style?: string;
    color?: string;
    quantity?: number;
    unitPrice?: number;
    totalAmount?: number;
    unit?: string;
  }>;
  subtotal?: number;
  totalAmount?: number;
  notes?: {
    sayTotal?: string;
    goodsDeliveryDestination?: string;
    goodsOrigin?: string;
    advisingBank?: string;
    allowance?: string;
    packing?: string;
    shipmentDate?: string;
    payment?: string;
    partialShipment?: string;
    piValidity?: string;
  };
  termsAndConditions?: string[];
  signatures?: {
    buyerLabel?: string;
    sellerLabel?: string;
    stampUrl?: string;
    includeBuyerSignature?: boolean;
    includeSellerSignature?: boolean;
  };
};

export function InvoicePdfDocument({
  piNumber = "MMF/001/26",
  issueDate,
  currency = "USD",
  seller,
  buyer,
  lineItems = [],
  subtotal = 0,
  totalAmount = 0,
  notes = {},
  termsAndConditions = [],
  signatures = {},
}: InvoicePdfDocumentProps) {
  const { lineItems: calculatedItems, totalAmount: calculatedTotal } =
    calculateInvoiceTotals(lineItems);
  const sayTotal = numberToWords(calculatedTotal, currency);

  const terms = termsAndConditions.length > 0 ? termsAndConditions : [
    "1. All prices are in USD.",
    "2. Payment terms: As agreed between buyer and seller.",
    "3. Goods once sold will not be taken back.",
    "4. Interest @ 18% p.a. will be charged if payment is not made within due date.",
    "5. Subject to Dhaka jurisdiction.",
    "6. E & OE.",
    "7. Negotiable.",
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company name */}
        <Text style={styles.companyName}>
          {seller?.companyName || "M.M FABRICS"}
        </Text>
        {/* Seller contact details */}
        <View style={styles.sellerContact}>
          <Text>{seller?.address || ""}</Text>
          <Text>
            {seller?.corporateOffice} • {seller?.contactNumber} •{" "}
            {seller?.email}
          </Text>
        </View>
        {/* Blue rule */}
        <View style={styles.blueRule} />
        {/* Title */}
        <Text style={styles.title}>PROFORMA INVOICE</Text>
        {/* Buyer and metadata */}
        <View style={styles.metaContainer}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Buyer / Consignee</Text>
            <Text style={styles.metaValue}>{buyer?.name}</Text>
            <Text style={styles.metaValue}>{buyer?.address}</Text>
            <Text style={styles.metaValue}>{buyer?.destinationCountry}</Text>
          </View>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>PI No.</Text>
            <Text style={styles.metaValue}>{piNumber}</Text>
            <Text style={styles.metaLabel}>Issue date</Text>
            <Text style={styles.metaValue}>
              {issueDate ? new Date(issueDate).toLocaleDateString() : ""}
            </Text>
            <Text style={styles.metaLabel}>Currency</Text>
            <Text style={styles.metaValue}>{currency}</Text>
          </View>
        </View>
        {/* Line-item table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Description</Text>
            <Text style={styles.tableHeaderCell}>Style</Text>
            <Text style={styles.tableHeaderCell}>Color</Text>
            <Text style={styles.tableHeaderCell}>Qty</Text>
            <Text style={styles.tableHeaderCell}>Unit</Text>
            <Text style={styles.tableHeaderCell}>Unit price</Text>
            <Text style={styles.tableHeaderCell}>Total</Text>
          </View>
          {calculatedItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.style}</Text>
              <Text style={styles.tableCell}>{item.color}</Text>
              <Text style={styles.tableCellRight}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>{item.unit}</Text>
              <Text style={styles.tableCellRight}>
                {currency} {Number(item.unitPrice ?? 0).toFixed(2)}
              </Text>
              <Text style={styles.tableCellRight}>
                {currency} {Number(item.totalAmount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        {/* Totals */}
        <View style={styles.totalsContainer}>
          <Text style={styles.totalsLabel}>
            Total {currency} {calculatedTotal.toFixed(2)}
          </Text>
        </View>
        {/* Say-total callout */}
        <View style={styles.sayTotal}>
          <Text style={styles.sayTotalLabel}>Say total: </Text>
          <Text style={styles.sayTotalValue}>{sayTotal}.</Text>
        </View>
        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          {[
            { label: "Say total", value: notes.sayTotal },
            { label: "Goods delivery destination", value: notes.goodsDeliveryDestination },
            { label: "Goods origin", value: notes.goodsOrigin },
            { label: "Advising bank", value: notes.advisingBank },
            { label: "Allowance", value: notes.allowance },
            { label: "Packing", value: notes.packing },
            { label: "Shipment date", value: notes.shipmentDate },
            { label: "Payment", value: notes.payment },
            { label: "Partial shipment", value: notes.partialShipment },
            { label: "PI validity", value: notes.piValidity },
          ]
            .filter((n) => n.value)
            .map((note, i) => (
              <View key={i} style={styles.notesItem}>
                <Text style={styles.notesItemNumber}>{i + 1}.</Text>
                <Text style={{ ...styles.notesItem, width: "auto" }}>
                  {note.label}: {note.value}
                </Text>
              </View>
            ))}
        </View>
        {/* Terms and conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsLabel}>Terms and conditions</Text>
          {terms.map((term, i) => (
            <View key={i} style={styles.termsItem}>
              <Text style={styles.termsItemNumber}>{i + 1}.</Text>
              <Text style={{ ...styles.notesItem, width: "auto" }}>{term}</Text>
            </View>
          ))}
        </View>
        {/* Signatures */}
        <View style={styles.signaturesContainer}>
          <View style={styles.signatureBlock}>
            <Text>Buyer authorized signature</Text>
            {signatures.buyerLabel && (
              <Text style={{ fontWeight: "bold" }}>{signatures.buyerLabel}</Text>
            )}
          </View>
          <View style={styles.signatureBlock}>
            <Text>Seller signature</Text>
            {signatures.sellerLabel && (
              <Text style={{ fontWeight: "bold" }}>{signatures.sellerLabel}</Text>
            )}
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>M.M FABRICS — Proforma Invoice</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
}
