import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/AuthServices";

const publicRoutes = ["/login", "/signup"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  TEACHER: [/^\/teacher/],
  ADMIN: [/^\/admin/],
  LEARNER: [/^\/learner/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
    user = null;
  }

  // Unauthenticated user handling
  if (!user) {
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // If user is authenticated and tries to access login/signup
  if (publicRoutes.includes(pathname)) {
    const dashboardRoutes = {
      TEACHER: "/teacher/profile",
      ADMIN: "/admin/profile",
      LEARNER: "/learner/profile",
    };
    return NextResponse.redirect(
      new URL(dashboardRoutes[user.role as Role] || "/login", request.url)
    );
  }

  // Role-based route access
  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    const routes = roleBasedRoutes[user?.role as Role];
    if (routes.some((route) => route.test(pathname))) {
      return NextResponse.next();
    }
  }

  // Redirect to appropriate profile page if unauthorized
  const defaultRoutes = {
    TEACHER: "/teacher/profile",
    ADMIN: "/admin/profile",
    LEARNER: "/learner/profile",
  };
  return NextResponse.redirect(
    new URL(defaultRoutes[user.role as Role] || "/login", request.url)
  );
}

export const config = {
  matcher: [
    "/teacher/:path*",
    "/learner/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/",
  ],
};