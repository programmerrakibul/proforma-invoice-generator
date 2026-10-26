import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type Model } from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true, collection: "customer" },
);
customerSchema.index({ ownerId: 1, name: 1 });
customerSchema.set("toJSON", { virtuals: true, versionKey: false });
customerSchema.set("toObject", { virtuals: true, versionKey: false });

export const CustomerModel = getModel("Customer", customerSchema) as Model<
  InferSchemaType<typeof customerSchema>
>;
export type CustomerDocument = InferSchemaType<typeof customerSchema>;
