import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = (globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
}) as MongooseCache;

if (process.env.NODE_ENV !== "production") {
  globalThis.mongooseCache = cached;
}

/**
 * Lazily connect to MongoDB using a cached connection.
 *
 * Never connects during module import. Call this inside Server Actions or
 * server-side data loaders only. Never import this file from a client component.
 */
export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
