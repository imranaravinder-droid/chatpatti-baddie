import { NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
  if (!CLIENT_ID) {
    return NextResponse.json({ error: "PINTEREST_CLIENT_ID not configured" }, { status: 500 });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const REDIRECT_URI = encodeURIComponent(`${baseUrl}/api/pinterest/callback`);
  const SCOPES = "ads:read,ads:write,boards:read,pins:read";
  const STATE = "hello";

  const authUrl = `https://www.pinterest.com/oauth/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&state=${STATE}`;

  return NextResponse.json({ url: authUrl });
}
