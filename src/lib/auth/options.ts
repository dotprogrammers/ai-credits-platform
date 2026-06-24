import { type AuthOptions, type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import type { UserRole, AccountStatus, KycStatus } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { JWT_MAX_AGE } from "@/lib/constants";

/**
 * Builds the callbacks and events for NextAuth configuration.
 * Separated from config.ts for modularity.
 */
export function buildAuthOptions(): Pick<
  AuthOptions,
  "callbacks" | "events"
> {
  return {
    callbacks: {
      /**
       * Control whether a user can sign in.
       */
      async signIn({ user, account }) {
        // OAuth providers - check if user exists and is active
        if (account?.provider !== "credentials" && user?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            if (
              existingUser.status === "SUSPENDED" ||
              existingUser.status === "BANNED"
            ) {
              return false;
            }
            return true;
          }

          // New OAuth user - create profile
          return true;
        }

        return true;
      },

      /**
       * Customize the JWT token contents.
       */
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user.id;
          token.email = user.email ?? "";
          token.username = (user as { username?: string }).username ?? "";
          token.role = (user as { role?: UserRole }).role ?? "USER";
          token.status =
            (user as { status?: AccountStatus }).status ?? "PENDING_VERIFICATION";
          token.kycStatus =
            (user as { kycStatus?: KycStatus }).kycStatus ?? "NOT_SUBMITTED";
          token.image = user.image ?? null;
        }

        // Handle session updates (e.g. from client-side `update()`)
        if (trigger === "update" && session) {
          if (session.user?.name) token.name = session.user.name;
          if (session.user?.image) token.image = session.user.image;
        }

        // Refresh user data from DB periodically (every 5 minutes)
        if (token.id && typeof token.iat === "number") {
          const now = Date.now();
          const tokenAge = now - token.iat * 1000;
          if (tokenAge > 5 * 60 * 1000) {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id },
              select: {
                status: true,
                role: true,
                image: true,
                kycRecord: { select: { status: true } },
              },
            });
            if (dbUser) {
              token.status = dbUser.status;
              token.role = dbUser.role;
              token.image = dbUser.image;
              token.kycStatus = dbUser.kycRecord?.status ?? "NOT_SUBMITTED";
            }
          }
        }

        return token;
      },

      /**
       * Customize the session object exposed to the client.
       */
      async session({ session, token }): Promise<Session> {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: (token.email ?? "") as string,
            username: (token.username ?? "") as string,
            role: (token.role ?? "USER") as string,
            status: (token.status ?? "ACTIVE") as string,
            kycStatus: (token.kycStatus ?? "NOT_SUBMITTED") as string,
            image: token.image as string | undefined,
          },
        };
      },

      /**
       * Control redirect URLs.
       */
      async redirect({ url, baseUrl }) {
        // Relative URLs are always safe
        if (url.startsWith("/")) return `${baseUrl}${url}`;

        // Allow redirects to the same origin
        if (new URL(url).origin === baseUrl) return url;

        return baseUrl;
      },
    },

    events: {
      /**
       * Create a wallet when a new user signs up.
       */
      async createUser({ user }) {
        if (user.id) {
          await prisma.wallet.create({
            data: {
              userId: user.id,
              balanceUsd: 0,
              balanceCredits: 0,
              frozenUsd: 0,
              frozenCredits: 0,
              totalDeposited: 0,
              totalWithdrawn: 0,
              totalTraded: 0,
            },
          });
        }
      },

      /**
       * Link OAuth account to existing user by email.
       */
      async signIn({ user, isNewUser }) {
        if (!isNewUser && user.id) {
          // Update last login timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
          });
        }
      },
    },
  };
}
