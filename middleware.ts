import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authRoutes, publicRoutes, getRoleRedirect, resolveRoleFromPath } from "@/lib/permissions/route-permissions";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const ROLE_COOKIE = "mediease-role";
const DEMO_SESSION_COOKIE = "mediease-demo-session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestedRole = resolveRoleFromPath(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  const { response, userId } = await updateSupabaseSession(request);
  const roleCookie = request.cookies.get(ROLE_COOKIE)?.value;
  const hasDemoSession = Boolean(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
  const isAuthenticated = Boolean(userId || hasDemoSession || roleCookie);

  if (isAuthRoute && isAuthenticated && roleCookie && roleCookie !== "guest") {
    return NextResponse.redirect(new URL(getRoleRedirect(roleCookie as Parameters<typeof getRoleRedirect>[0]), request.url));
  }

  if (!isPublicRoute && requestedRole && !isAuthenticated) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (requestedRole && roleCookie && roleCookie !== requestedRole && roleCookie !== "guest") {
    return NextResponse.redirect(new URL(getRoleRedirect(roleCookie as Parameters<typeof getRoleRedirect>[0]), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
