import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

/**
 * Better Auth instance with MongoDB adapter.
 *
 * Uses a cached MongoDB client to avoid creating new connections on every
 * serverless invocation or Next.js dev hot reload.
 */

let client: MongoClient | null = null;

function getClient(): MongoClient {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
  }
  return client;
}

function getDb() {
  return getClient().db("proforma-invoice");
}

export const auth = betterAuth({
  database: mongodbAdapter(getDb()),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
