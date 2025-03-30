import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define route matchers for different types of routes
const isPublicRoute = createRouteMatcher(["/", "/marketing(.*)"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/app(.*)"]);
const isAuthRoute = createRouteMatcher(["/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Get user ID from auth state
  const { userId } = await auth();

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect authenticated users trying to access auth pages
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect routes that require authentication
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};