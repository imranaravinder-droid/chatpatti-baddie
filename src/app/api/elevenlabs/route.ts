import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voice_id, stability, similarity_boost, style } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    if (!text?.trim()) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id || "pNInz6obpgDQGcFmaJgB"}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          model_id: "eleven_multilingual_v2",
          text,
          voice_settings: {
            stability: stability ?? 0.35,
            similarity_boost: similarity_boost ?? 0.8,
            style: style ?? 0.25,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="voice.mp3"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}