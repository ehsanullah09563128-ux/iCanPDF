import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limit = rateLimit(`login:${ip}`, 10, 60_000);
  if (!limit.allowed) return Response.json({ error: "Too many login attempts. Try again shortly." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) return Response.json({ error: "Email and password are required." }, { status: 400 });
    const [user] = await db.select({ id: users.id, name: users.name, email: users.email, passwordHash: users.passwordHash, plan: users.plan, deletedAt: users.deletedAt }).from(users).where(eq(users.email, email)).limit(1);
    if (!user || !user.passwordHash || user.deletedAt || !(await compare(body.password, user.passwordHash))) return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    await setSessionCookie({ id: user.id, name: user.name, email: user.email, plan: user.plan });
    return Response.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch {
    return Response.json({ error: "We couldn’t log you in. Please try again." }, { status: 500 });
  }
}
