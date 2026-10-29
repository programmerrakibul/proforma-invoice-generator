import { getModel } from "@/lib/db/model-helpers";
import {
  INVOICE_CURRENCIES,
  type InvoiceCurrency,
} from "@/config/bank-accounts";
import type { InvoiceGoodsDetail } from "@/data/goods";
import mongoose, { type InferSchemaType, type PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

export type InvoiceNotes = InvoiceGoodsDetail[];

export interface Invoice {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  piNumber: string;
  piNumberVersion?: number;
  issueDate: Date;
  deliveryDate?: Date;
  currency: InvoiceCurrency;
  status: "draft" | "exported";
  seller: Seller;
  buyerId: mongoose.Types.ObjectId;
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

const invoiceGoodsDetailSchema = new mongoose.Schema<InvoiceGoodsDetail>(
  {
    key: { type: String, required: true, trim: true, maxlength: 100 },
    label: { type: String, required: true, trim: true, maxlength: 100 },
    value: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema<Invoice>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    piNumber: {
      type: String,
      required: true,
      trim: true,
    },
    piNumberVersion: { type: Number, required: false },
    issueDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: false },
    currency: {
      type: String,
      enum: [...INVOICE_CURRENCIES],
      required: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["draft", "exported"],
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
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    buyer: {
      name: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    totalQuantity: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    notes: { type: [invoiceGoodsDetailSchema], default: [] },
    termsAndConditions: [{ type: String, trim: true, maxlength: 1000 }],
  },
  { timestamps: true, collection: "invoice" },
);

invoiceSchema.index({ ownerId: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, status: 1, updatedAt: -1 });
invoiceSchema.index({ ownerId: 1, piNumber: 1 }, { unique: true });
invoiceSchema.index(
  { piNumberVersion: 1, piNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { piNumberVersion: 2 },
    name: "unique_generated_pi_number",
  },
);

invoiceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

invoiceSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
});

invoiceSchema.plugin(mongoosePaginate);

export const InvoiceModel = getModel("invoice", invoiceSchema) as PaginateModel<
  InferSchemaType<typeof invoiceSchema>
>;

export type InvoiceDocument = InferSchemaType<typeof invoiceSchema>;

let generatedPiNumberIndexPromise: Promise<string> | null = null;

export async function ensureGeneratedPiNumberIndex(): Promise<void> {
  if (!generatedPiNumberIndexPromise) {
    generatedPiNumberIndexPromise = InvoiceModel.collection.createIndex(
      { piNumberVersion: 1, piNumber: 1 },
      {
        unique: true,
        partialFilterExpression: { piNumberVersion: 2 },
        name: "unique_generated_pi_number",
      },
    );
  }

  try {
    await generatedPiNumberIndexPromise;
  } catch (error) {
    generatedPiNumberIndexPromise = null;
    throw error;
  }
}
