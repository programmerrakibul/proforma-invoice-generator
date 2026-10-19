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

export interface Invoice {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  piNumber: string;
  issueDate: Date;
  seller: Seller;
  buyer: Buyer;
  lineItems: LineItem[];
  totalQuantity: number;
  totalAmount: number;
  termsAndConditions: string[];
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
    totalQuantity: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    termsAndConditions: [{ type: String }],
  },
  { timestamps: true },
);

invoiceSchema.index({ ownerId: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, piNumber: 1 });

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
