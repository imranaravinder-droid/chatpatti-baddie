import { NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";

export async function GET() {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || KEYS.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || KEYS.INSTAGRAM_REDIRECT_URI;
  if (!clientId) return NextResponse.json({ error: "Instagram not configured" }, { status: 500 });

  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const scope = "instagram_business_basic,instagram_business_content_publish";
  const url =
    `https://www.facebook.com/v23.0/dialog/oauth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}&scope=${encodeURIComponent(scope)}&response_type=code`;

  const res = NextResponse.redirect(url);
  res.cookies.set("ig_oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 600 });
  return res;
}
