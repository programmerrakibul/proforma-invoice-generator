"use server";

import { auth } from "@/lib/auth";

/**
 * Requires an authenticated user. Derives the owner id from the session —
 * never from client input.
 *
 * @returns The authenticated user's safe profile.
 * @throws When no user is authenticated.
 */
export async function requireUser() {
  const session = await auth.api.getSession();
  if (!session?.user) {
    throw new Error("Unauthenticated: no active session.");
  }
  return session.user;
}
