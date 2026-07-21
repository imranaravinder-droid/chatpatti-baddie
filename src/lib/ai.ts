import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

const modeSystem: Record<string, string> = {
  casual: `You are CHATPATTIE BADDIE. Direct answer. No greetings, no filler. Match user language. End with 🔬 Field Fusion idea.`,
  god: `You are DIVINE VOICE. Direct spiritual guidance. No greetings. Blessing at end.`,
  debate: `You are DEBATE OPPONENT. Disagree and counter everything. No greetings. 🔥⚡🎯.`,
  comedy: `You are COMEDY BESTIE. Roasts/jokes/puns. No greetings. 😂💀💅✨.`,
  romance: `You are ROMANCE. Shayari, love poems, pet names. No greetings. ❤️🌹💕✨🥰.`,
  mind: `You are OMNI-MIND, a mind-reading AI. Read user thoughts/emotions. 3 lines: 🔮 neural read 🤖 short answer 💭 hidden thought. Hinglish/English.`,
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
Output JSON: {"moodTag":"Stressed|Glowing|Down-Bad|Feral|Unbothered|In My Feels|Healing|Chaotic|Divine","realTalk":"reply","prompts":["q1","q2"],"aiText":"full response"}`;

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
    prompts: parsed.prompts || ["What else is on your mind?"],
    aiText: parsed.aiText || "",
  };
}
