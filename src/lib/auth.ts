import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/lib/db/models";

/**
 * NextAuth v4 configuration.
 *
 * Uses the Credentials provider with bcrypt password verification against the
 * Mongoose User model. Sessions are JWT-based (self-contained, signed cookie),
 * so no database round-trip is required on every request while still keeping
 * password hashes out of the browser.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Invalid email or password.");
        }

        const user = await UserModel.findOne({ email })
          .select("+passwordHash")
          .lean<{
            _id: mongoose.Types.ObjectId;
            email: string;
            name: string;
            role: string;
            passwordHash: string;
          }>()
          .exec();

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as {
          id: string;
          email?: string | null;
          name?: string | null;
          image?: string | null;
          role?: string | null;
        };
        token.id = authUser.id;
        token.email = authUser.email as string | undefined;
        token.name = authUser.name as string | undefined;
        token.role = authUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      const updatedSession = session as {
        user: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          role?: string | null;
        };
      };
      if (updatedSession.user) {
        updatedSession.user.id = token.id as string;
        updatedSession.user.role = token.role as string | undefined;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};

const nextAuthInstance = NextAuth(authOptions);

export const { GET, POST } = nextAuthInstance;
export const { auth, signIn, signOut } = nextAuthInstance;

export type { NextAuthOptions };
