import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json({ error: "refresh_token required" }, { status: 400 });
    }

    const CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
    const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: "Pinterest credentials not configured" }, { status: 500 });
    }

    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        scope: "boards:read,pins:read",
      }).toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Refresh failed");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Pinterest refresh error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
