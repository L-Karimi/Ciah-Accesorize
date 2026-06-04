import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminRoutes = ["/admin", "/dashboard"];
const protectedRoutes = ["/account", "/orders", "/wishlist", "/cart"];
const guestOnlyRoutes = ["/auth/login", "/auth/register"];

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!token && (isAdminRoute || isProtectedRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminRoute && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (token && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
