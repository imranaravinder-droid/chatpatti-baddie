import { NextRequest, NextResponse } from "next/server";

// ElevenLabs voices — male (Haneul) + female (cute avatar).
// Males: Antoni (pNInz6obpgDQGcFmaJgB) — clear, warm, intellectual.
// Females: Rachel (21m00Tcm2ahkPI2O7RjSn) — soft & natural; or Bella (AZnzkRFLL7CZ9qdbSR8M).
const FEMALE_VOICE = "21m00Tcm2ahkPI2O7RjSn"; // Rachel — sweet, natural female
const MALE_VOICE = "pNInz6obpgDQGcFmaJgB"; // Antoni — warm, clear male

export async function POST(req: NextRequest) {
  try {
    const { text, voice_id, gender, stability, similarity_boost, style, use_speaker_boost } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing — set ELEVENLABS_API_KEY in Vercel env" }, { status: 500 });
    if (!text?.trim()) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const voiceId = voice_id || (gender === "female" ? FEMALE_VOICE : MALE_VOICE);
    const clean = text.replace(/[#*_~`\[\]()]/g, "").trim().substring(0, 500);

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          model_id: "eleven_multilingual_v2",
          text: clean,
          voice_settings: {
            stability: stability ?? 0.35,
            similarity_boost: similarity_boost ?? 0.8,
            style: style ?? 0.25,
            use_speaker_boost: use_speaker_boost ?? true,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `elevenlabs: ${res.status} ${err.slice(0, 200)}` }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="voice.mp3"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "tts failed" }, { status: 500 });
  }
}
