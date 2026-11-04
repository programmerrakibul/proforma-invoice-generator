import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true, collection: "customer" }
);
customerSchema.set("toJSON", { virtuals: true, versionKey: false });
customerSchema.set("toObject", { virtuals: true, versionKey: false });

customerSchema.plugin(mongoosePaginate);

export const CustomerModel = getModel(
  "Customer",
  customerSchema
) as PaginateModel<InferSchemaType<typeof customerSchema>>;
export type CustomerDocument = InferSchemaType<typeof customerSchema>;
