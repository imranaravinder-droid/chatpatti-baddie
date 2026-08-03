import { NextRequest } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  casual: "You are CP Baddie. Answer DIRECTLY. No introductions, no greetings, no 'here is'. Just give the answer. Match their language. ALWAYS remember and reference the earlier conversation: if they repeat a question, reference their last answer. Use the full chat history as memory of what was said before.",
  god: "You are DIVINE VOICE. Direct wisdom only. No intro. Blessing at end. Remember past conversation context.",
  debate: "You are DEBATE OPPONENT. Counter directly with ??. No intro. Remember the points already discussed.",
  comedy: "You are COMEDY BESTIE. Joke or roast directly. No setup. Reference earlier jokes for continuity.",
  romance: "You are ROMANCE. Direct shayari/poetry. No intro. Remember what they said before.",
  mind: "You read minds. 3 lines: ?? thought ?? analysis ?? reply. Reference earlier messages.",
};

// Keywords that suggest the question needs CURRENT / real-time facts.
const NEEDS_WEB = [
  "latest", "current", "news", "today", "yesterday", "this week", "this year", "recent",
  "population", "stock price", "stock market", "exchange rate", "currency", "weather",
  "who won", "who is", "match", "score", "result", "election", "president", "pm",
  "prime minister", "released", "launch", "new movie", "new song", "new album",
  "trending", "virgin", "happened", "happening", "live", "breaking", "update", "2026",
  "last night", "did you hear", "is it true", "confirmed", "latest update",
];

function needsWebSearch(message: string): boolean {
  const m = message.toLowerCase();
  return NEEDS_WEB.some((k) => m.includes(k.toLowerCase()));
}

// Heuristic for whether a study/world question could benefit from a web lookup.
// We let the compound model (native web search) handle these.
function isStudyWorldQuestion(message: string): boolean {
  const m = message.toLowerCase();
  const studyKw = [
    "explain", "teach me", "what is", "what are", "how does", "how do", "define",
    "meaning", "history of", "capital of", "geography", "science", "math", "maths",
    "physics", "chemistry", "biology", "cbse", "icse", "ib ", "curriculum", "syllabus",
    "exam", "chapter", "country", "culture", "war", "treaty", "revolution", "empire",
    "language of", "religion", "economy", "gdp", "climate", "about japan", "about korea",
    "about india", "about america", "about uk", "learn", "homework", "notes",
  ];
  return studyKw.some((k) => m.includes(k));
}

function chooseModel(message: string, forceWeb: boolean): string {
  if (forceWeb || needsWebSearch(message) || isStudyWorldQuestion(message)) {
    return "groq/compound-mini"; // native web search + reasoning
  }
  return "llama-3.1-8b-instant"; // fast, generous rate limits
}

export async function POST(req: NextRequest) {
  const { message, mode, lang, history, web } = await req.json();
  if (!message) return new Response("Message required", { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response("API key not configured", { status: 500 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));

      try {
        const messages = [
          { role: "system", content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.casual },
          ...(history || []).slice(-10).map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: `Lang:${lang || "en"} User: "${message}"` },
        ];

        const model = chooseModel(message, web === true);

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 500,
            stream: true,
          }),
        });

        if (!groqRes.ok || !groqRes.body) {
          // Fall back to the fast model if the compound model hits rate limits.
          if (groqRes.status === 429 || groqRes.status >= 400) {
            const fallback = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages,
                temperature: 0.7,
                max_tokens: 500,
                stream: true,
              }),
            });
            if (fallback.ok && fallback.body) {
              await pipe(fallback, send);
              send("data: [DONE]\n\n");
              controller.close();
              return;
            }
          }
          send(`data: ${JSON.stringify({ error: `Groq ${groqRes.status}: ${groqRes.statusText}` })}\n\n`);
          controller.close();
          return;
        }

        await pipe(groqRes, send);
        send("data: [DONE]\n\n");
      } catch (err: any) {
        send(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function pipe(res: Response, send: (text: string) => void) {
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const t = line.trim();
      if (!t || t === "data: [DONE]") continue;
      if (t.startsWith("data: ")) {
        try {
          const json = JSON.parse(t.slice(6));
          const content = json.choices?.[0]?.delta?.content || "";
          if (content) send(`data: ${JSON.stringify({ text: content })}\n\n`);
        } catch {}
      }
    }
  }
}
