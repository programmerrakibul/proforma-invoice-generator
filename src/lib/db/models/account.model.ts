import { getModel } from "@/lib/db/model-helpers";
import mongoose, { type InferSchemaType, type Model } from "mongoose";


export interface Account {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new mongoose.Schema<Account>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
    oauth_token_secret: { type: String },
    oauth_token: { type: String },
  },
  { timestamps: true, collection: "account" },
);

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const AccountModel = getModel("account", accountSchema) as Model<
  InferSchemaType<typeof accountSchema>
>;

export type AccountDocument = InferSchemaType<typeof accountSchema>;
