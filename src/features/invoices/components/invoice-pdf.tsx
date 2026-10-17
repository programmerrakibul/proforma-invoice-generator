"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";
import sealImageSrc from "@/assets/mm_fabrics_seal.png";

const sealImage: any = sealImageSrc;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingRight: 50,
    paddingBottom: 40,
    paddingLeft: 50,
    fontSize: 9,
  },
  companyHeader: {
    alignItems: "center",
    marginBottom: 4,
  },
  companyName: {
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a2e6a",
    textAlign: "center",
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 7.5,
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 1,
  },
  companyContact: {
    fontSize: 7.5,
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  blueRule: {
    height: 2,
    backgroundColor: "#2563eb",
    marginBottom: 10,
    width: "100%",
  },
  invoiceTitle: {
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
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
    fontSize: 8.5,
    color: "#1a1a1a",
  },
  metaValue: {
    fontSize: 8.5,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  metaSpacer: {
    flex: 0.5,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a2e6a",
    color: "#ffffff",
  },
  tableHeaderCell: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 8,
    fontWeight: "bold",
    borderWidth: 0.5,
    borderColor: "#1a1a1a",
    textAlign: "left",
  },
  tableHeaderCellRight: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 8,
    fontWeight: "bold",
    borderWidth: 0.5,
    borderColor: "#1a1a1a",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  tableCell: {
    fontSize: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    textAlign: "left",
  },
  tableCellRight: {
    fontSize: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    textAlign: "right",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  totalsQuantity: {
    width: "14.28%",
    textAlign: "right",
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  totalsAmount: {
    width: "14.28%",
    textAlign: "right",
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 8,
    fontWeight: "bold",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  totalsAmountLast: {
    width: "14.28%",
    textAlign: "right",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 8,
    fontWeight: "bold",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  emptyRows: {
    flexDirection: "row",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  emptyCell: {
    width: "14.28%",
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  emptyCellRight: {
    width: "14.28%",
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  emptyCellRightLast: {
    width: "14.28%",
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  tableCellRightLast: {
    fontSize: 8,
    borderRightWidth: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    textAlign: "right",
  },
  emptyRow: {
    flexDirection: "row",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  sayTotalContainer: {
    marginTop: 16,
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
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
    fontFamily: "serif",
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
    marginTop: 20,
  },
  signatureBlock: {
    width: "33%",
    paddingTop: 20,
    fontSize: 8,
    color: "#1a1a1a",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderColor: "#1a1a1a",
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 8,
    color: "#1a1a1a",
  },
  sealImage: {
    width: 55,
    height: 55,
    marginTop: 4,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#666666",
    borderTopWidth: 1,
    borderColor: "#1a1a1a",
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

  const totalQuantity = calculatedItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

  const defaultTerms = [
    "1. Negotiable; any Bank in Bangladesh",
    "2. L/C amendment charge are on L/C applicant account.",
    "3. Maturity date must be calculated from the date of delivery.",
    "4. After signature the delivery challan or discrepancy won’t be acceptable.",
    "5. Overdue interest (if any) should be pay by opener.",
    "6. Payment to be made on maturity date in US Dollar.",
    "7. All apparent errors/discrepancy (if any) would be acceptable by opener.",
  ];

  const terms = termsAndConditions.length > 0 ? termsAndConditions : defaultTerms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <Text style={styles.companyName}>M.M FABRICS</Text>
        </View>
        <Text style={styles.companyAddress}>
          Address: Sobhan Super Market, South Birampur, Madhabdi, Narsingdi, Bangladesh
        </Text>
        <Text style={styles.companyContact}>
          Corporate Office: House#16, B-Road, 16, Sector: 13, Uttara, Dhaka-1230, Bangladesh
        </Text>
        <Text style={styles.companyContact}>
          Contact Number: 01777589989 | Email: jewel@mmfabrics-bd.com
        </Text>
        <View style={styles.blueRule} />
        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>PROFORMA INVOICE</Text>
        {/* Buyer and Meta */}
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
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>
              {issueDate ? new Date(issueDate).toLocaleDateString("en-GB") : ""}
            </Text>
          </View>
          <View style={styles.metaSpacer} />
        </View>
        {/* Line-item table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Description of Goods</Text>
            <Text style={styles.tableHeaderCell}>Style</Text>
            <Text style={styles.tableHeaderCell}>Color</Text>
            <Text style={styles.tableHeaderCellRight}>Quantity (Yds)</Text>
            <Text style={styles.tableHeaderCellRight}>Unit Price (USD)</Text>
            <Text style={styles.tableHeaderCellRight}>Total Amount (USD)</Text>
          </View>
          {calculatedItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.style}</Text>
              <Text style={styles.tableCell}>{item.color}</Text>
              <Text style={styles.tableCellRight}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>
                {Number(item.unitPrice ?? 0).toFixed(2)}
              </Text>
              <Text style={styles.tableCellRightLast}>
                {Number(item.totalAmount).toFixed(2)}
              </Text>
            </View>
          ))}
          {/* Empty rows to match screenshot */}
          <View style={styles.emptyRow}>
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCellRight} />
            <Text style={styles.emptyCellRight} />
            <Text style={styles.emptyCellRightLast} />
          </View>
          <View style={styles.emptyRow}>
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCellRight} />
            <Text style={styles.emptyCellRight} />
            <Text style={styles.emptyCellRightLast} />
          </View>
          {/* Totals row */}
          <View style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, borderRightWidth: 0 }} />
            <Text style={styles.emptyCell} />
            <Text style={styles.emptyCell} />
            <Text style={styles.totalsQuantity}>
              {totalQuantity}
            </Text>
            <Text style={styles.emptyCellRight} />
            <Text style={styles.totalsAmountLast}>
              {calculatedTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        {/* Say-total */}
        <View style={styles.sayTotalContainer}>
          <Text style={styles.sayTotalLabel}>Say total:</Text>
          <Text style={styles.sayTotalValue}>
            {sayTotal}.
          </Text>
        </View>
        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          {[
            { label: "Goods Delivery Destination", value: notes.goodsDeliveryDestination },
            { label: "Goods Origin", value: notes.goodsOrigin },
            { label: "Advising Bank", value: notes.advisingBank },
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
                <Text style={{ ...styles.notesItem, width: "auto", marginLeft: 2 }}>
                  {note.label}: {note.value}
                </Text>
              </View>
            ))}
        </View>
        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsLabel}>Terms &amp; Conditions:</Text>
          {terms.map((term, i) => (
            <View key={i} style={styles.termsItem}>
              <Text style={styles.termsItemNumber}>{i + 1}.</Text>
              <Text style={{ ...styles.notesItem, width: "auto", marginLeft: 2 }}>
                {term}
              </Text>
            </View>
          ))}
        </View>
        {/* Signatures */}
        <View style={styles.signaturesContainer}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Buyer Authorized Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>For M.M FABRICS</Text>
            {signatures.stampUrl && (
              <Image src={signatures.stampUrl} style={styles.sealImage} />
            )}
            {!signatures.stampUrl && <Image src={sealImage} style={styles.sealImage} />}
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
