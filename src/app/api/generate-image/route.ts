import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const res = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) return NextResponse.json({ error: "Image service error" }, { status: 502 });

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({ image: base64, mimeType: "image/jpeg" });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: err.message || "Image generation failed" }, { status: 500 });
  }
}
