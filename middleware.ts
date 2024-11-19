import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  // Skip middleware for non-admin routes and static files
  if (!path.startsWith("/admin") && !path.startsWith("/otp")) {
    return NextResponse.next();
  }

  // Check for admin session
  const sessionCookie = request.cookies.get("admin_session")?.value;

  if (path.startsWith("/otp")) {
    // If accessing OTP page with valid session, redirect to admin
    if (sessionCookie) {
      try {
        const session = await decrypt(sessionCookie);
        if (session && new Date(session.expiresAt) > new Date()) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch (error) {
        // Invalid session, continue to OTP page
      }
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/otp", request.url));
  }

  try {
    const session = await decrypt(sessionCookie);
    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL("/otp", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/otp", request.url));
  }
};

export const config = {
  matcher: ["/admin/:path*", "/otp"],
};
