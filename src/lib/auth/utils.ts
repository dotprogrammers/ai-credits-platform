import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "./config";
import prisma from "@/lib/db/prisma";
import {
  UnauthorizedError,
  ForbiddenError,
  KycRequiredError,
  AccountSuspendedError,
} from "@/lib/errors";
import type { UserRole, KycStatus } from "@prisma/client";

/**
 * Get the current session on the server side.
 * Returns null if not authenticated.
 */
export async function getSession() {
  return getServerSession(authConfig);
}

/**
 * Get the currently authenticated user.
 * Throws UnauthorizedError if not authenticated.
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session.user;
}

/**
 * Require authentication. Redirects to login page if not authenticated.
 * Use this in Server Components.
 */
export async function requireAuth(): Promise<{
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: string;
  kycStatus: KycStatus;
  image?: string | null;
}> {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (session.user.status === "SUSPENDED" || session.user.status === "BANNED") {
    throw new AccountSuspendedError();
  }

  return session.user as {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    status: string;
    kycStatus: KycStatus;
    image?: string | null;
  };
}

/**
 * Require a specific role. Throws ForbiddenError if the user doesn't have it.
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<ReturnType<typeof requireAuth> extends Promise<infer U> ? U : never> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError("You do not have permission to perform this action");
  }

  return user;
}

/**
 * Require the user to have completed KYC verification.
 * Throws KycRequiredError if KYC is not verified.
 */
export async function requireKyc(): Promise<ReturnType<typeof requireAuth> extends Promise<infer U> ? U : never> {
  const user = await requireAuth();

  if (user.kycStatus !== "VERIFIED") {
    throw new KycRequiredError();
  }

  return user;
}

/**
 * Require admin role (ADMIN or SUPER_ADMIN).
 */
export async function requireAdmin() {
  return requireRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Require super admin role.
 */
export async function requireSuperAdmin() {
  return requireRole(["SUPER_ADMIN"]);
}

/**
 * Get the full user record from the database including related data.
 */
export async function getFullUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      kycRecord: true,
      affiliateProfile: true,
    },
  });
}
