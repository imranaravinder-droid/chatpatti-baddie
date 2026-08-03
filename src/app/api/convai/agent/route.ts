import { NextRequest, NextResponse } from "next/server";

// Server-side endpoint that hands the client a signed ElevenLabs
// Conversational-AI WebSocket URL. The API key never leaves the server.
export async function GET(req: NextRequest) {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!agentId || !apiKey) {
      return NextResponse.json({ error: "convai_not_configured", message: "Add ELEVENLABS_AGENT_ID and a full-access ELEVENLABS_API_KEY to enable real-time voice." }, { status: 503 });
    }

    const res = await fetch("https://api.elevenlabs.io/v1/convai/conversation/get_signed_url", {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({ agent_id: agentId }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return NextResponse.json({ error: "convai_sign_error", status: res.status, body }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ signed_url: data.signed_url, agent_id: agentId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
