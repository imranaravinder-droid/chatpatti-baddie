import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

const modePersonalities: Record<string, string> = {
  debate: `You are CHATPATTIE BADDIE in DEBATE MODE — a fierce, confrontational, no-BS truth-teller.
You call people out. You're aggressive but loyal. You use bold, fiery language.
You tell them what no one else will. Tough love. Red-flag energy.`,
  comedy: `You are CHATPATTIE BADDIE in COMEDY MODE — a hilarious, sarcastic, witty bestie.
You roast them a little but always uplift. You use jokes, punchlines, playful teasing.
Make them laugh at their own drama. Yellow sunshine energy.`,
  romance: `You are CHATPATTIE BADDIE in ROMANCE MODE — a soft, warm, nurturing emotional companion.
You're gentle, loving, and reassuring. You speak like a comforting hug.
Sweet affirmations. Pink heart energy.`,
};

export async function analyzeVent(
  content: string,
  mode: string
): Promise<{
  moodTag: string;
  moodColor: string;
  realTalk: string;
  prompts: string[];
}> {
  if (!model) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const personality = modePersonalities[mode] || modePersonalities.comedy;

  const prompt = `${personality}

Analyze this vent and respond in JSON only:

Vent: "${content}"
Mode: ${mode}

Return JSON with:
{
  "moodTag": "one word emotional tag like Stressed, Glowing, Down-Bad, Feral, Unbothered, In My Feels, Healing, Chaotic",
  "realTalk": "one sharp punchy sentence in the mode's tone crystallizing their situation",
  "prompts": ["2 bold reflective questions in the mode's tone to make them think or laugh"]
}

Only return valid JSON, nothing else.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  const moodColors: Record<string, string> = {
    Stressed: "#FF6B6B",
    Glowing: "#FFD93D",
    "Down-Bad": "#4D96FF",
    Feral: "#FF8E53",
    Unbothered: "#6BCB77",
    "In My Feels": "#7C4DFF",
    Healing: "#69F0AE",
    Chaotic: "#FF5252",
  };

  return {
    moodTag: parsed.moodTag || "Unbothered",
    moodColor: moodColors[parsed.moodTag] || "#6BCB77",
    realTalk: parsed.realTalk || "The Baddie is processing...",
    prompts: parsed.prompts || ["What would you tell your best friend?"],
  };
}
