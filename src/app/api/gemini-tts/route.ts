import { NextRequest, NextResponse } from "next/server";
import { KEYS } from "@/lib/keys";

export const maxDuration = 30;

// Male voices available in Gemini TTS: kore, puck, charon, fenrir, orus, algenib,
// alnilam, etc. "kore" is a warm, natural male voice (the user's requested model).
function pickVoice(text: string) {
  return "kore";
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY || KEYS.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Gemini key missing" }, { status: 500 });

    const clean = text.replace(/[#*_~`\[\]()]/g, "").trim().substring(0, 500);
    const voiceName = (voice || pickVoice(clean)).toLowerCase();
    const model = "gemini-2.5-flash-preview-tts";

    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: clean }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `gemini: ${res.status} ${err.slice(0, 300)}` }, { status: 502 });
    }

    const data: any = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const audio = parts.find((p: any) => p?.inlineData);
    if (!audio) {
      const txt = parts.find((p: any) => p?.text)?.text;
      return NextResponse.json({ error: `no audio: ${txt?.slice(0, 120) || "unknown"}` }, { status: 502 });
    }

    const b64 = audio.inlineData.data;
    const pcm = Buffer.from(b64, "base64") as unknown as ArrayBuffer;
    const wav = pcmToWav(pcm, 24000);

    return new NextResponse(wav, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'attachment; filename="voice.wav"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "tts failed" }, { status: 502 });
  }
}

function pcmToWav(pcm: ArrayBuffer, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(buffer);
  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }
  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(pcm));
  return buffer;
}
