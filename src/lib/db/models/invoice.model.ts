import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type Model } from "mongoose";

export interface LineItem {
  _id?: mongoose.Types.ObjectId;
  description: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  unit: string;
}

export interface InvoiceNotes {
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
}

export interface Signatures {
  buyerLabel?: string;
  sellerLabel?: string;
  stampUrl?: string;
  includeBuyerSignature: boolean;
  includeSellerSignature: boolean;
}

export interface Seller {
  companyName: string;
  address: string;
  corporateOffice: string;
  contactNumber: string;
  email: string;
}

export interface Buyer {
  name: string;
  address: string;
  destinationCountry: string;
}

export interface Invoice {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  issueDate: Date;
  currency: string;
  status: "draft" | "ready" | "exported" | "archived";
  seller: Seller;
  buyer: Buyer;
  lineItems: LineItem[];
  subtotal: number;
  totalAmount: number;
  notes: InvoiceNotes;
  termsAndConditions: string[];
  signatures: Signatures;
  createdAt: Date;
  updatedAt: Date;
}

const lineItemSchema = new mongoose.Schema<LineItem>(
  {
    description: { type: String, required: true, trim: true },
    style: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "Yds" },
  },
  { _id: true },
);

const invoiceSchema = new mongoose.Schema<Invoice>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    invoiceNumber: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "ready", "exported", "archived"],
      default: "draft",
      index: true,
    },
    seller: {
      companyName: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      corporateOffice: { type: String, required: true, trim: true },
      contactNumber: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },
    buyer: {
      name: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      destinationCountry: { type: String, required: true, trim: true },
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    notes: {
      sayTotal: { type: String, default: "" },
      goodsDeliveryDestination: { type: String, default: "" },
      goodsOrigin: { type: String, default: "" },
      advisingBank: { type: String, default: "" },
      allowance: { type: String, default: "" },
      packing: { type: String, default: "" },
      shipmentDate: { type: String, default: "" },
      payment: { type: String, default: "" },
      partialShipment: { type: String, default: "" },
      piValidity: { type: String, default: "" },
    },
    termsAndConditions: [{ type: String }],
    signatures: {
      buyerLabel: { type: String, default: "" },
      sellerLabel: { type: String, default: "" },
      stampUrl: { type: String, default: "" },
      includeBuyerSignature: { type: Boolean, default: false },
      includeSellerSignature: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

invoiceSchema.index({ ownerId: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, status: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, invoiceNumber: 1 });

invoiceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

invoiceSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
});

export const InvoiceModel = getModel("Invoice", invoiceSchema) as Model<
  InferSchemaType<typeof invoiceSchema>
>;

export type InvoiceDocument = InferSchemaType<typeof invoiceSchema>;
