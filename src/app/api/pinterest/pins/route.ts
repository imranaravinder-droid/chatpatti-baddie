import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, title, description, board_id, image_url, media_id } = await req.json();

    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    const payload: any = {};

    if (title) payload.title = title;
    if (description) payload.description = description;
    if (board_id) payload.board_id = board_id;

    if (media_id) {
      payload.media_source = { source_type: "video_id", media_id };
    } else if (image_url) {
      payload.media_source = { source_type: "image_url", url: image_url };
    } else {
      return NextResponse.json({ error: "image_url or media_id required" }, { status: 400 });
    }

    const res = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create pin");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Pinterest pin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
