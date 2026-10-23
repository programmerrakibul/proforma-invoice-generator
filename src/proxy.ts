import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

async function hasSessionCookie(request: NextRequest): Promise<boolean> {
  const token = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
  if (!token) return false;

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) return false;

  return true;
}

export async function proxy(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  const isAuthenticated = await hasSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  console.log(isAuthenticated);

  if (pathname.startsWith("/invoices") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/auth/") && isAuthenticated) {
    return NextResponse.redirect(new URL("/invoices", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/invoices", "/auth/:path*"],
};
