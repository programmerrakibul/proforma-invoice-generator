import "next-auth";

declare module "next-auth" {
  /**
   * Augment the built-in Session user with the fields our auth provider sets.
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  /**
   * Augment the JWT token with the custom claims set in the jwt callback.
   */
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  }
}
