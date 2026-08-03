import { NextRequest } from "next/server";

// Server-side Speech-to-Text via Groq Whisper. Works in ANY browser
// (Chrome, Edge, Firefox, Safari, in-app webviews) because the client
// just uploads an audio blob; no browser SpeechRecognition needed.
export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("API key not configured", { status: 500 });

  const form = await req.formData();
  const file = form.get("file");
  const lang = (form.get("language") as string) || "hi-IN";

  if (!(file instanceof Blob)) return new Response("No audio file", { status: 400 });

  const body = new FormData();
  body.append("file", file, "recording.webm");
  body.append("model", "whisper-large-v3-turbo");
  body.append("language", lang.split("-")[0]);
  body.append("response_format", "json");

  try {
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(data?.error?.message || "STT failed", { status: res.status });
    }
    const text = (data?.text || "").trim();
    return Response.json({ text });
  } catch (err: any) {
    return new Response(err?.message || "STT error", { status: 500 });
  }
}
