import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js middleware for auth and route protection.
 * Runs on the Edge runtime for all matching routes.
 */

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/trading",
  "/wallet",
  "/affiliate",
  "/settings",
  "/profile",
];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

// Routes that require KYC verification
const KYC_ROUTES = ["/trading", "/wallet"];

// Auth routes (redirect to dashboard if already authenticated)
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect authenticated routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check account status
    if (token.status === "SUSPENDED" || token.status === "BANNED") {
      return NextResponse.redirect(new URL("/auth/error?error=AccountSuspended", request.url));
    }

    // Check KYC for trading/wallet routes
    if (KYC_ROUTES.some((route) => pathname.startsWith(route))) {
      if (token.kycStatus !== "VERIFIED") {
        // Allow access to KYC submission page
        if (!pathname.startsWith("/kyc")) {
          const kycUrl = new URL("/kyc/verify", request.url);
          kycUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(kycUrl);
        }
      }
    }
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
