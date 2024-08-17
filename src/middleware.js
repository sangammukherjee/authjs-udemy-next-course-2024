import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiRoutesList,
  authRoutesList,
  protectedRoute,
  publicRoutesList,
} from "./config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthUser = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(apiRoutesList);
  const isPublicRoute = publicRoutesList.includes(nextUrl.pathname);
  const isAuthRoute = authRoutesList.includes(nextUrl.pathname);

  if (isApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isAuthUser) {
      return Response.redirect(new URL(protectedRoute, nextUrl));
    }

    return null;
  }

  if (!isAuthUser && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
