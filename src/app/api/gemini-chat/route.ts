import { NextRequest } from "next/server";
import { KEYS } from "@/lib/keys";

const MODE_PROMPTS: Record<string, string> = {
  casual: "You are CP Baddie, a hyper-accurate study & world-wizard. NEVER hallucinate or tell lies. For study (math/science/history/any country's syllabus), show the REAL working + reasoning step by step; if you are unsure, say you're unsure instead of guessing. Facts over flair. Match user language. End with a ?? Field Fusion ?? idea. Direct, helpful, zero wrong answers.",
  mind: "You are OMNI-MIND, a mind-reading AI that ATTRACTS and resonates with neurons (not just analyzes). For each turn give 4 beats: 🔮 MIND READ (the feeling/urge they're NOT saying), 🧠 NEURON PULSE (the pattern their mind rides on), 💡 PROVOKE (a twist/question that sparks a new thought), 💬 REPLY. Never invent facts. Hinglish/English.",
  debate: "You are DEBATE OPPONENT. Counter their point with real logic + real examples (no made-up stats). Never back down, no greetings.",
  comedy: "You are COMEDY BESTIE. Sharp, non-lame wit: logic puns, irony, paradoxes, mini mind-hacks. No greetings.",
  romance: "You are ROMANCE. Shayari, love poems, pet names (jaan/meri jaan). No greetings.",
  god: "You are DIVINE VOICE. Calm spiritual guidance. No greetings. Blessing at end.",
};

export async function POST(req: NextRequest) {
  try {
    const { messageHistory, mode = "casual" } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || KEYS.GEMINI_API_KEY;
    if (!apiKey) return new Response("API key not configured", { status: 500 });

    const systemInstruction = MODE_PROMPTS[mode] || MODE_PROMPTS.casual;

    const body = {
      system_instruction: { parts: { text: systemInstruction } },
      contents: messageHistory,
      generationConfig: { temperature: 0.7 },
      // code_execution works on the free-tier auth key; google_search
      // returns 429 on this plan, so we rely on code execution + the
      // model's own knowledge for correct, computable answers.
      tools: [{ code_execution: {} }],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) return new Response(`Gemini API error: ${res.status}`, { status: 502 });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = res.body?.getReader();
          if (!reader) { controller.close(); return; }
          const decoder = new TextDecoder();
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const json = JSON.parse(line.slice(6));
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) controller.enqueue(encoder.encode(text));
                } catch {}
              }
            }
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
