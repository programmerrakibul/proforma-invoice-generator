import { getCurrentUser } from "@/lib/auth/get-current-user";
import type { User } from "@/lib/auth";

/**
 * Requires an authenticated user. Derives the owner id from the session —
 * never from client input.
 *
 * @returns The authenticated user's safe profile.
 * @throws When no user is authenticated.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated: no active session.");
  }
  return user;
}
