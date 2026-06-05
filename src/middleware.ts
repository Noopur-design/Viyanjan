import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "vj_admin";

/**
 * Auth guard for the admin console and admin/PII API routes.
 *
 * Public (never blocked):
 *   GET  /api/menu, /api/menu/[id], /api/categories   (browse the menu)
 *   POST /api/orders                                  (a customer places an order)
 *
 * Protected (require the admin cookie):
 *   /admin/*  (except /admin/login)
 *   writes to /api/menu, /api/categories
 *   GET /api/orders and everything under /api/orders/[id]  (customer PII + status)
 */
function needsAuth(pathname: string, method: string): boolean {
  if (pathname === "/admin/login") return false;
  if (pathname.startsWith("/admin")) return true;

  // listing all orders (PII) is admin; placing one is public
  if (pathname === "/api/orders") return method !== "POST";
  // order detail + status changes are admin/kitchen
  if (pathname.startsWith("/api/orders/")) return true;

  // menu/category reads are public; writes are admin
  if (pathname.startsWith("/api/menu") || pathname.startsWith("/api/categories")) {
    return method !== "GET";
  }
  return false;
}

function isAuthed(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token || !process.env.ADMIN_TOKEN) return false;
  // constant-time comparison to prevent timing attacks
  if (token.length !== process.env.ADMIN_TOKEN.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ process.env.ADMIN_TOKEN.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!needsAuth(pathname, req.method)) return NextResponse.next();
  if (isAuthed(req)) return NextResponse.next();

  // API calls get a clean 401; page requests are redirected to login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/menu",
    "/api/menu/:path*",
    "/api/categories",
    "/api/categories/:path*",
    "/api/orders",
    "/api/orders/:path*",
    "/api/admin/:path*",
  ],
};
