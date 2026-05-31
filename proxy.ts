import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-safe-admin-jwt-secret-key-10220";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionToken = request.cookies.get("admin_session")?.value;

  // Protect Admin Dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifyJWT(sessionToken, JWT_SECRET);
    if (!decoded || (decoded.exp as number) < Math.floor(Date.now() / 1000)) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // Redirect to Dashboard if already logged in
  if (pathname === "/admin/login") {
    if (sessionToken) {
      const decoded = await verifyJWT(sessionToken, JWT_SECRET);
      if (decoded && (decoded.exp as number) > Math.floor(Date.now() / 1000)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};
