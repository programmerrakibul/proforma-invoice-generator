"use server";

import { auth } from "@/lib/auth";

/**
 * Resolves the currently authenticated user for server-side use.
 *
 * @returns The authenticated user's safe profile (passwordHash excluded), or
 * null when no session is active.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
