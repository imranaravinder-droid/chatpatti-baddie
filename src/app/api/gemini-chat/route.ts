import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are OMNI-MIND, a warm, fast mind-reading AI assistant for CHATPATTIE BADDIE.
Rules:
1. Speak naturally in Hinglish/English mix — warm, concise, helpful.
2. Read between the lines. Respond to what they mean, not just what they type.
3. Lead directly with the answer. No fluff, no greetings, no robotic intros.
4. Keep responses short and fast. 2-3 lines max.
5. Never mention cryptocurrency, web3, or irrelevant tech.
`;

export async function POST(req: NextRequest) {
  try {
    const { messageHistory } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response("API key not configured", { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: messageHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return new Response("Error", { status: 500 });
  }
}
