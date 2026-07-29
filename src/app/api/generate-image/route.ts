import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { KEYS } from "@/lib/keys";

const RATIO_MAP: Record<string, string> = {
  "16:9": "16:9",
  "9:16": "9:16",
  "1:1": "1:1",
  "3:4": "3:4",
  "4:3": "4:3",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspectRatio = "16:9" } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY || KEYS.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const ratio = RATIO_MAP[aspectRatio] || "16:9";

    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: ratio,
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) return NextResponse.json({ error: "No image generated" }, { status: 500 });

    return NextResponse.json({ image: imageBytes, aspectRatio: ratio });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: err.message || "Image generation failed", detail: String(err) }, { status: 500 });
  }
}
