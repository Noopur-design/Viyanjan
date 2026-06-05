import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE = "vj_admin";

// In-memory rate limiter: ip → { attempts, lockedUntil }
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { blocked: boolean; remainingMs: number } {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry) return { blocked: false, remainingMs: 0 };
  if (entry.lockedUntil > now) {
    return { blocked: true, remainingMs: entry.lockedUntil - now };
  }
  if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
    attempts.delete(ip);
  }
  return { blocked: false, remainingMs: 0 };
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(ip, entry);
}

function clearFailures(ip: string) {
  attempts.delete(ip);
}

// POST /api/admin/login — exchange the admin password for a session cookie.
export async function POST(req: Request) {
  const ip = getIp(req);
  const { blocked, remainingMs } = checkRateLimit(ip);

  if (blocked) {
    const mins = Math.ceil(remainingMs / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { password, remember } = body as { password?: string; remember?: boolean };

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    recordFailure(ip);
    const entry = attempts.get(ip);
    const left = MAX_ATTEMPTS - (entry?.count ?? 0);
    return NextResponse.json(
      { error: "Invalid password", attemptsLeft: Math.max(left, 0) },
      { status: 401 }
    );
  }

  clearFailures(ip);
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8; // 30 days or 8 hours

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, process.env.ADMIN_TOKEN ?? "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}

// DELETE /api/admin/login — log out.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
