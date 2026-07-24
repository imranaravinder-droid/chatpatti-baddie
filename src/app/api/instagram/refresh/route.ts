import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: "access_token required" }, { status: 400 });
    }

    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${access_token}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error_message || data.error || "Refresh failed");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Instagram refresh error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
