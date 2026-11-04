import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface CompanyProfile {
  companyName: string;
  address: string;
  corporateOffice: string;
  contactNumber: string;
  email: string;
  logoUrl?: string;
}

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "member";
  companyProfile: CompanyProfile;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    companyProfile: {
      companyName: { type: String, default: "" },
      address: { type: String, default: "" },
      corporateOffice: { type: String, default: "" },
      contactNumber: { type: String, default: "" },
      email: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
    },
  },
  { timestamps: true, collection: "user" }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const sanitized = ret as { passwordHash?: string };
    delete sanitized.passwordHash;
    return sanitized;
  },
});

userSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const sanitized = ret as { passwordHash?: string };
    delete sanitized.passwordHash;
    return sanitized;
  },
});

userSchema.plugin(mongoosePaginate);

export const UserModel = getModel("user", userSchema) as Model<
  InferSchemaType<typeof userSchema>
>;

export type UserDocument = InferSchemaType<typeof userSchema>;
