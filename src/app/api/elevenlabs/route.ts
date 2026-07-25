import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

const client = new ElevenLabsClient({ apiKey: API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { text, voice_id, stability, similarity_boost, style } = await req.json();

    if (!API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 500 });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceId = voice_id || DEFAULT_VOICE_ID;

    const { data, rawResponse } = await client.textToSpeech
      .convert(voiceId, {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
        voiceSettings: {
          stability: stability ?? 0.35,
          similarityBoost: similarity_boost ?? 0.85,
          style: style ?? 0.40,
          useSpeakerBoost: true,
        },
      })
      .withRawResponse();

    const charCost = rawResponse.headers.get("character-cost");
    const requestId = rawResponse.headers.get("request-id");
    const traceId = rawResponse.headers.get("x-trace-id");

    console.log(`[ElevenLabs] char=${charCost} req=${requestId} trace=${traceId}`);

    const audioBuffer = await data.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="cb_talk.mp3"',
        "X-Character-Cost": charCost || "",
      },
    });
  } catch (error: any) {
    console.error("ElevenLabs route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
