import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { User } from "@/lib/auth";

/**
 * Resolves the currently authenticated user for server-side use.
 *
 * @returns The authenticated user's safe profile, or null when no session is active.
 */
export async function getCurrentUser(): Promise<User | null> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  return session?.user ?? null;
}
