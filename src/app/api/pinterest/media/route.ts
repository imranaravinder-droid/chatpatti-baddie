import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    // Register a video/media upload to get S3 upload URL
    const res = await fetch("https://api.pinterest.com/v5/media", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ media_type: "video" }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to register media");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Pinterest media error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
