import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const videoId = searchParams.get("video");

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "YOUTUBE_API_KEY not configured" }, { status: 500 });

    // Single video lookup
    if (videoId) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Search
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=12&key=${apiKey}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Failed to fetch from YouTube" }, { status: 500 });
  }
}
