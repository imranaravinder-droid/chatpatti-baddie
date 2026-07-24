import { NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
  if (!CLIENT_ID) {
    return NextResponse.json({ error: "INSTAGRAM_CLIENT_ID not configured" }, { status: 500 });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const REDIRECT_URI = encodeURIComponent(`${baseUrl}/api/instagram/callback`);
  const SCOPES = "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments";

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;

  return NextResponse.json({ url: authUrl });
}
