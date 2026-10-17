import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { getModel } from "@/lib/db/model-helpers";

/**
 * NextAuth v4 Session collection.
 * Records active authenticated sessions scoped to a User.
 */
export interface Session {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  expires: Date;
  sessionToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<Session>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expires: { type: Date, required: true },
    sessionToken: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

export const SessionModel = getModel("Session", sessionSchema) as Model<
  InferSchemaType<typeof sessionSchema>
>;

export type SessionDocument = InferSchemaType<typeof sessionSchema>;
