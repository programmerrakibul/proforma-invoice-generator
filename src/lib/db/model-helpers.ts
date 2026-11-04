import mongoose from "mongoose";

/**
 * Safe model registration helper that avoids OverwriteModelError during
 * Next.js development hot reloads.
 */
export function getModel<T>(
  name: string,
  schema: mongoose.Schema<T>
): mongoose.Model<T> {
  const existing = mongoose.models[name];
  if (existing) {
    return existing as mongoose.Model<T>;
  }
  return mongoose.model<T>(name, schema);
}
