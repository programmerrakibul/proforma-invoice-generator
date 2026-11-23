import mongoose, { InferSchemaType, Model } from "mongoose";
import { getModel } from "../model-helpers";

export const COMPANY_SINGLETON_KEY = "COMPANY_PROFILE";

export interface Company {
  _id?: mongoose.Types.ObjectId | string;
  singletonKey: string;
  companyName: string;
  address: string;
  corporateOffice: string;
  contactNumber: string;
  email: string;
  logoUrl?: string;
}

const companySchema = new mongoose.Schema<Company>(
  {
    singletonKey: {
      type: String,
      default: COMPANY_SINGLETON_KEY,
      unique: true,
      immutable: true,
      uppercase: true,
    },
    companyName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    corporateOffice: {
      type: String,
      trim: true,
      required: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      required: true,
      maxLength: 11,
    },
    logoUrl: {
      type: String,
      trim: true,
      required: false,
    },
  },
  { timestamps: true, collection: "company_profile" },
);

companySchema.set("toJSON", { virtuals: true, versionKey: false });
companySchema.set("toObject", { virtuals: true, versionKey: false });

export type CompanyDocument = InferSchemaType<typeof companySchema>;

export const CompanyModel = getModel(
  "company_profile",
  companySchema,
) as Model<CompanyDocument>;
