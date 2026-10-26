import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type Model } from "mongoose";

export interface LineItem {
  _id?: mongoose.Types.ObjectId;
  fabric: string;
  construction: string;
  width: string;
  style: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
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
}

export interface InvoiceNotes {
  goodsDeliveryDestination: string;
  goodsOrigin: string;
  advisingBank: string;
  allowance: string;
  packing: string;
  shipmentDate: string;
  payment: string;
  partialShipment: string;
  piValidity: string;
}

export interface Invoice {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  piNumber: string;
  issueDate: Date;
  currency: string;
  status: "draft" | "exported";
  seller: Seller;
  buyer: Buyer;
  lineItems: LineItem[];
  subtotal: number;
  totalQuantity: number;
  totalAmount: number;
  notes: InvoiceNotes;
  termsAndConditions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const lineItemSchema = new mongoose.Schema<LineItem>(
  {
    fabric: { type: String, required: true, trim: true },
    construction: { type: String, required: true, trim: true },
    width: { type: String, required: true, trim: true },
    style: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
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
    piNumber: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    currency: { type: String, required: true, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "exported", "archived"],
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
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    totalQuantity: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    notes: {
      goodsDeliveryDestination: { type: String, required: true },
      goodsOrigin: { type: String, required: true },
      advisingBank: { type: String, required: true },
      allowance: { type: String, required: true },
      packing: { type: String, required: true },
      shipmentDate: { type: String, required: true },
      payment: { type: String, required: true },
      partialShipment: { type: String, required: true },
      piValidity: { type: String, required: true },
    },
    termsAndConditions: [{ type: String }],
  },
  { timestamps: true, collection: "invoice" },
);

invoiceSchema.index({ ownerId: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, status: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, piNumber: 1 });

invoiceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

invoiceSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
});

export const InvoiceModel = getModel("invoice", invoiceSchema) as Model<
  InferSchemaType<typeof invoiceSchema>
>;

export type InvoiceDocument = InferSchemaType<typeof invoiceSchema>;
