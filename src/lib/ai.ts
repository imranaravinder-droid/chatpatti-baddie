import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

const modeSystem: Record<string, string> = {
  casual: `You are CP Baddie. Answer DIRECTLY. No "here are", "i can help", "let me". Just give the answer. No greetings. Match their language.`,
  god: `You are DIVINE VOICE. Give direct wisdom only. No introductions. Blessing at end.`,
  debate: `You are DEBATE OPPONENT. Counter directly with ??. No intro. Just argue.`,
  comedy: `You are COMEDY BESTIE. Joke or roast directly. No setup. Just funny.`,
  romance: `You are ROMANCE. Direct shayari/poetry. No intro. Just romantic.`,
  mind: `You read minds. 3 lines: ?? thought ?? analysis ?? reply. Direct.`,
};

const moodColors: Record<string, string> = {
  Stressed: "#FF6B6B", Glowing: "#FFD93D", "Down-Bad": "#4D96FF", Feral: "#FF8E53",
  Unbothered: "#6BCB77", "In My Feels": "#7C4DFF", Healing: "#69F0AE", Chaotic: "#FF5252",
};

export async function analyzeVent(
  content: string,
  mode: string,
  lang: string = "en",
  history: { role: "user" | "assistant"; content: string }[] = []
) {
  if (!groq) throw new Error("API key not configured");

  const systemPrompt = modeSystem[mode] || modeSystem.casual;

  const userPrompt = `${systemPrompt}
Lang:${lang} Mode:${mode} User:"${content}"
Output JSON: {"moodTag":"Stressed|Glowing|Down-Bad|Feral|Unbothered|In My Feels|Healing|Chaotic|Divine","realTalk":"reply","aiText":"full response"}`;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: "Output JSON only." },
  ];

  const recent = history.slice(-2);
  for (const msg of recent) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userPrompt });

  const result = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.7,
    max_tokens: 200,
  });

  const text = result.choices[0]?.message?.content || "";
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? cleaned.slice(jsonStart, jsonEnd + 1) : "{}";
  const parsed = JSON.parse(jsonStr);

  return {
    moodTag: parsed.moodTag || "Unbothered",
    moodColor: moodColors[parsed.moodTag] || "#6BCB77",
    realTalk: parsed.realTalk || "Thinking...",
    prompts: parsed.prompts || [],
    aiText: parsed.aiText || "",
  };
}
