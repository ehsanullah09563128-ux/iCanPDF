import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limit = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!limit.allowed) return Response.json({ error: "Too many attempts. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  try {
    const body = await request.json() as { name?: string; email?: string; password?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    if (!name || name.length < 2 || name.length > 120) return Response.json({ error: "Please enter your full name." }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return Response.json({ error: "Use at least 8 characters, one number, and one uppercase letter." }, { status: 400 });

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    const passwordHash = await hash(password, 12);
    const [user] = await db.insert(users).values({ name, email, passwordHash }).returning({ id: users.id, name: users.name, email: users.email, plan: users.plan });
    await setSessionCookie(user);
    return Response.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } }, { status: 201 });
  } catch {
    return Response.json({ error: "We couldn’t create your account. Please try again." }, { status: 500 });
  }
}
