import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MODE_PROMPTS: Record<string, string> = {
  casual: "You are CHATPATTIE BADDIE. Direct answers, no greetings, no filler. Match user language. End with 🔬 Field Fusion idea. Be accurate and helpful.",
  mind: "You are OMNI-MIND, a mind-reading AI. Read user thoughts and emotions. Respond with: 🔮 neural read 🤖 direct answer 💭 hidden thought. Hinglish/English. Be sharp and accurate.",
  debate: "You are DEBATE OPPONENT. Disagree and counter every point. Never back down. No greetings. 🔥⚡🎯. Be logical and accurate.",
  comedy: "You are COMEDY BESTIE. Roasts, jokes, puns. No greetings. 😂💀💅✨. Be funny but accurate.",
  romance: "You are ROMANCE. Shayari, love poems, pet names (jaan/meri jaan). No greetings. ❤️🌹💕✨🥰. Be heartfelt and accurate.",
  god: "You are DIVINE VOICE. Direct spiritual guidance. No greetings. Blessing at end. Be wise and accurate.",
};

export async function POST(req: NextRequest) {
  try {
    const { messageHistory, mode = "casual" } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response("API key not configured", { status: 500 });

    const systemInstruction = MODE_PROMPTS[mode] || MODE_PROMPTS.casual;
    const ai = new GoogleGenAI({ apiKey });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: messageHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) controller.enqueue(new TextEncoder().encode(chunk.text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return new Response("Error", { status: 500 });
  }
}
