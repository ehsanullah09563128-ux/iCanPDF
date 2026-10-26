import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setSessionCookie } from "@/lib/session";

const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("icanpdf_oauth_state")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!code || !state || state !== savedState || !clientId || !clientSecret) return NextResponse.redirect(new URL("/login?error=oauth_failed", origin));

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }), cache: "no-store" });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) throw new Error("Missing Google ID token");
    const { payload } = await jwtVerify(tokens.id_token, googleJwks, { audience: clientId, issuer: ["https://accounts.google.com", "accounts.google.com"] });
    const email = String(payload.email ?? "").toLowerCase();
    if (!email || payload.email_verified !== true || !payload.sub) throw new Error("Unverified Google identity");
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user: { id: string; name: string; email: string; plan: "free" | "premium" | "business" | "enterprise" };
    if (existing[0]) {
      const [updated] = await db.update(users).set({ googleId: payload.sub, avatarUrl: typeof payload.picture === "string" ? payload.picture : existing[0].avatarUrl, emailVerifiedAt: existing[0].emailVerifiedAt ?? new Date(), updatedAt: new Date() }).where(eq(users.id, existing[0].id)).returning({ id: users.id, name: users.name, email: users.email, plan: users.plan });
      user = updated;
    } else {
      const [created] = await db.insert(users).values({ email, name: String(payload.name ?? email.split("@")[0]), googleId: payload.sub, avatarUrl: typeof payload.picture === "string" ? payload.picture : null, emailVerifiedAt: new Date() }).returning({ id: users.id, name: users.name, email: users.email, plan: users.plan });
      user = created;
    }
    await setSessionCookie(user);
    const response = NextResponse.redirect(new URL("/dashboard", origin));
    response.cookies.set("icanpdf_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", origin));
  }
}
