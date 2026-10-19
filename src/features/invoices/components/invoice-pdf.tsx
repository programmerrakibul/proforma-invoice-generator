"use client";

import sealImageSrc from "@/assets/mm_fabrics_seal.png";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { numberToWords } from "@/features/invoices/utils/number-to-words";
import {
  Document,
  Page,
  Image as PDFImage,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type InvoicePdfData = {
  piNumber: string;
  issueDate?: string | null;
  currency: string;
  seller: {
    companyName: string;
    address: string;
    corporateOffice: string;
    contactNumber: string;
    email: string;
  };
  buyer: {
    name: string;
    address: string;
    destinationCountry: string;
  };
  lineItems: Array<{
    description: string;
    style: string;
    color: string;
    quantity?: number | null;
    unitPrice?: number | null;
    totalAmount?: number;
    unit: string;
  }>;
  subtotal: number;
  totalAmount: number;
  notes: {
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
  termsAndConditions: string[];
  signatures: {
    buyerLabel?: string;
    sellerLabel?: string;
    stampUrl?: string;
    includeBuyerSignature?: boolean;
    includeSellerSignature?: boolean;
  };
};

const sealImage = sealImageSrc as unknown as string;

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
  tableCellRightLast: {
    fontSize: 8,
    borderRightWidth: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    textAlign: "right",
  },
  totalsQuantity: {
    width: "16.66%",
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
    width: "16.66%",
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
    width: "16.66%",
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
  emptyRow: {
    flexDirection: "row",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  emptyCell: {
    width: "16.66%",
    borderRightWidth: 0.5,
    borderRightColor: "#1a1a1a",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
  },
  emptyCellRightLast: {
    width: "16.66%",
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1a1a",
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
    fontSize: 8,
    color: "#1a1a1a",
    marginTop: 2,
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

const defaultTerms = [
  "1. Negotiable; any Bank in Bangladesh",
  "2. L/C amendment charge are on L/C applicant account.",
  "3. Maturity date must be calculated from the date of delivery.",
  "4. After signature the delivery challan or discrepancy won't be acceptable.",
  "5. Overdue interest (if any) should be pay by opener.",
  "6. Payment to be made on maturity date in US Dollar.",
  "7. All apparent errors/discrepancy (if any) would be acceptable by opener.",
];

export function InvoicePdfDocument(data: InvoicePdfData) {
  const { lineItems: calculatedItems, totalAmount: calculatedTotal } =
    calculateInvoiceTotals(data.lineItems);
  const sayTotal = numberToWords(calculatedTotal, data.currency);

  const totalQuantity = calculatedItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

  const terms = data.termsAndConditions.length > 0 ? data.termsAndConditions : defaultTerms;
  const notes = data.notes;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
        <Text style={styles.invoiceTitle}>PROFORMA INVOICE</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Buyer / Consignee</Text>
            <Text style={styles.metaValue}>{data.buyer.name}</Text>
            <Text style={styles.metaValue}>{data.buyer.address}</Text>
            <Text style={styles.metaValue}>{data.buyer.destinationCountry}</Text>
          </View>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>PI No.</Text>
            <Text style={styles.metaValue}>{data.piNumber}</Text>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>
              {data.issueDate ? new Date(data.issueDate).toLocaleDateString("en-GB") : ""}
            </Text>
          </View>
          <View style={styles.metaSpacer} />
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, width: "30%" }}>Description of Goods</Text>
            <Text style={{ ...styles.tableHeaderCell, width: "14%" }}>Style</Text>
            <Text style={{ ...styles.tableHeaderCell, width: "14%" }}>Color</Text>
            <Text style={{ ...styles.tableHeaderCellRight, width: "14%" }}>Quantity (Yds)</Text>
            <Text style={{ ...styles.tableHeaderCellRight, width: "14%" }}>Unit Price ({data.currency})</Text>
            <Text style={{ ...styles.tableHeaderCellRight, width: "14%" }}>Total Amount ({data.currency})</Text>
          </View>
          {calculatedItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, width: "30%" }}>{item.description}</Text>
              <Text style={{ ...styles.tableCell, width: "14%" }}>{item.style}</Text>
              <Text style={{ ...styles.tableCell, width: "14%" }}>{item.color}</Text>
              <Text style={{ ...styles.tableCellRight, width: "14%" }}>{Number(item.quantity ?? 0).toLocaleString()}</Text>
              <Text style={{ ...styles.tableCellRight, width: "14%" }}>{Number(item.unitPrice ?? 0).toFixed(2)}</Text>
              <Text style={{ ...styles.tableCellRightLast, width: "14%" }}>{Number(item.totalAmount).toFixed(2)}</Text>
            </View>
          ))}
          {[...Array(2)].map((_, i) => (
            <View key={`empty-${i}`} style={styles.emptyRow}>
              <Text style={{ ...styles.emptyCell, width: "30%" }} />
              <Text style={{ ...styles.emptyCell, width: "14%" }} />
              <Text style={{ ...styles.emptyCell, width: "14%" }} />
              <Text style={{ ...styles.emptyCell, width: "14%" }} />
              <Text style={{ ...styles.emptyCell, width: "14%" }} />
              <Text style={{ ...styles.emptyCellRightLast, width: "14%" }} />
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={{ ...styles.tableCell, width: "30%", borderRightWidth: 0 }} />
            <Text style={{ ...styles.emptyCell, width: "14%" }} />
            <Text style={{ ...styles.emptyCell, width: "14%" }} />
            <Text style={{ ...styles.totalsQuantity, width: "14%" }}>{totalQuantity.toLocaleString()}</Text>
            <Text style={{ ...styles.emptyCell, width: "14%" }} />
            <Text style={{ ...styles.totalsAmountLast, width: "14%" }}>{calculatedTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sayTotalContainer}>
          <Text style={styles.sayTotalLabel}>Say total:</Text>
          <Text style={styles.sayTotalValue}>{sayTotal}.</Text>
        </View>

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
                <Text>{note.label}: {note.value}</Text>
              </View>
            ))}
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsLabel}>Terms &amp; Conditions:</Text>
          {terms.map((term, i) => (
            <View key={i} style={styles.termsItem}>
              <Text style={styles.notesItemNumber}>{i + 1}.</Text>
              <Text>{term.replace(/^\d+\.\s*/, "")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.signaturesContainer}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Buyer Authorized Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>For M.M FABRICS</Text>
            <PDFImage src={sealImage} style={styles.sealImage}  />
          </View>
        </View>

        <View style={styles.footer}>
          <Text>M.M FABRICS — Proforma Invoice</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
}

export type { InvoicePdfData };
