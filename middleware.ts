import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // server-side cookie read
  const { pathname } = request.nextUrl;

  // guest routes
  const isAuthPage = ["/login", "/register"].includes(pathname);

  // লগইন না করলে private route → /login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // লগইন করা হলে guest route → /dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// middleware কোথায় apply হবে
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], 
};
