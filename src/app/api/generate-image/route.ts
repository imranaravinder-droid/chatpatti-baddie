import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { KEYS } from "@/lib/keys";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY || KEYS.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (!part?.inlineData?.data) return NextResponse.json({ error: "No image generated" }, { status: 500 });

    return NextResponse.json({ image: part.inlineData.data, mimeType: part.inlineData.mimeType || "image/png" });
  } catch (err: any) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: err.message || "Image generation failed", detail: String(err) }, { status: 500 });
  }
}
