import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";

export async function GET(req: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || KEYS.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || KEYS.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || KEYS.INSTAGRAM_REDIRECT_URI;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");

  if (error || errorReason) {
    return NextResponse.redirect(
      `https://cpbaddie.vercel.app/instagram?error=${encodeURIComponent(errorReason || error || "Access denied")}`
    );
  }

  const savedState = req.cookies.get("ig_oauth_state")?.value;
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(
      `https://cpbaddie.vercel.app/instagram?error=${encodeURIComponent("State mismatch. Please try again.")}`
    );
  }

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v23.0/oauth/access_token?client_id=${clientId}` +
        `&client_secret=${clientSecret}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code=${encodeURIComponent(code)}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(
        `https://cpbaddie.vercel.app/instagram?error=${encodeURIComponent(tokenData.error?.message || "Token exchange failed")}`
      );
    }
    const accessToken = tokenData.access_token;

    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );
    const profile = await profileRes.json();
    if (!profile.id) {
      return NextResponse.redirect(
        `https://cpbaddie.vercel.app/instagram?error=${encodeURIComponent("Could not fetch profile. Is the account a public Professional account?")}`
      );
    }

    const res = NextResponse.redirect(`https://cpbaddie.vercel.app/instagram?connected=1`);
    res.cookies.set("ig_token", accessToken, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 60 });
    res.cookies.set("ig_username", profile.username || "", { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 60 });
    res.cookies.delete("ig_oauth_state");
    return res;
  } catch (err: any) {
    return NextResponse.redirect(
      `https://cpbaddie.vercel.app/instagram?error=${encodeURIComponent(err.message || "Unexpected error")}`
    );
  }
}
