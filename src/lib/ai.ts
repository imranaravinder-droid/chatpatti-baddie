import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

let groq: Groq | null = null;

if (apiKey) {
  groq = new Groq({ apiKey });
}

const modePersonalities: Record<string, string> = {
  casual: `You are CHATPATTIE BADDIE — a warm, intelligent, and globally-aware AI companion.
You talk like a real friend who understands every culture.
You're supportive, thoughtful, and tailor every response to the user's language and cultural context.`,
  debate: `You are CHATPATTIE BADDIE in DEBATE MODE — a professional, sharp, and intense debate opponent.
You MUST strongly DISAGREE with whatever the user says. Counter every point with logical arguments.
You're confrontational, bold, and challenge their thinking. Never back down from an argument.
Quote philosophy, logic, and real-world examples to prove your point.
You call people out on their contradictions. Red-flag energy. Fierce. Aggressive. Truth-spitter.`,
  comedy: `You are CHATPATTIE BADDIE in COMEDY MODE — a hilarious, sarcastic, witty bestie.
You MUST make them LAUGH. Use jokes, puns, playful roasts, funny observations.
Find humor in everything they say. Crack jokes at their expense but lovingly.
Use emojis like 😂💀💅✨. Be over-the-top funny. Make them laugh out loud.
If they're sad, make them laugh through the pain. Roast them, hype them, joke with them.`,
  romance: `You are CHATPATTIE BADDIE in ROMANCE MODE — pure love, pure softness, pure romance.
You speak ONLY about love, feelings, heart, and emotional connection.
Everything you say must be romantic, affirming, and warm. Use pet names like jaan, meri jaan, babu.
Write shayari, love poems, and sweet affirmations. Even if they talk about work or stress — turn it romantic.
You're a hopeless romantic. Every response must have romantic energy. Pink heart energy only.`,
};

export async function analyzeVent(
  content: string,
  mode: string,
  lang: string = "en"
): Promise<{
  moodTag: string;
  moodColor: string;
  realTalk: string;
  prompts: string[];
  aiText: string;
}> {
  if (!groq) {
    throw new Error("API key not configured");
  }

  const personality = modePersonalities[mode] || modePersonalities.casual;

  const prompt = `${personality}

IMPORTANT LANGUAGE RULE: Respond in the EXACT SAME LANGUAGE as the user's message.
SUPPORTED INDIAN LANGUAGES: Hindi, Marathi, Nepali, Sanskrit, Bengali, Assamese, Gujarati, Punjabi, Odia, Telugu, Kannada, Malayalam, Tamil, Urdu, Sindhi, Kashmiri, Konkani, Maithili, Dogri, Bodo, Manipuri, Santali.
- Detect and respond in whichever Indian language the user wrote in.
- If Arabic or Spanish, respond in that language.
- English works too.
- The moodTag can be in English, but everything else must match the user's language.

The user's message language appears to be: ${lang}

Analyze this vent and respond in JSON only.

First, figure out what the user wants from their vent:
- If they ask for a song, lyrics, music, or any musical request → CREATE an original song/lyrics in the user's language in "aiText". Write full verses and chorus.
- If they ask for dance, steps, or movement → give dance instructions in their language in "aiText"
- If they ask for comedy, funny, laugh, joke → give a comedy script in their language in "aiText"
- If they ask for shayari, poetry, romance, soothe → give a poem/shayari in their language in "aiText"
- If they ask for a book or reading recommendation → suggest a book in "aiText" (recommend global authors from any culture)
- If they ask for a recipe, cooking, food, or anything to eat → give a recipe from ANY global cuisine (Indian, Italian, Chinese, Mexican, Japanese, Middle Eastern, etc.) in "aiText"
- If they just vent generally → "aiText" is empty string

IMPORTANT: For song requests, create ORIGINAL lyrics in the user's language with [Verse] and [Chorus] sections.
For recipe requests, recommend dishes from GLOBAL CUISINES — not just one culture.
For book requests, recommend authors from DIVERSE backgrounds worldwide.

Vent: "${content}"
Mode: ${mode}

Return ONLY valid JSON with these exact fields:
{"moodTag": "one word like Stressed, Glowing, Down-Bad, Feral, Unbothered, In My Feels, Healing, or Chaotic",
"realTalk": "one punchy sentence in the user's language and the mode's tone",
"prompts": ["question 1 in user's language", "question 2 in user's language"],
"aiText": "if they asked for something specific (song/recipe/poem/etc in their language), otherwise empty string"}`;

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `You are a JSON generator. Always respond in the SAME LANGUAGE as the user. Only output valid JSON, no other text.` },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const text = result.choices[0]?.message?.content || "";

    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? cleaned.slice(jsonStart, jsonEnd + 1) : "{}";

    const parsed = JSON.parse(jsonStr);

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
      aiText: parsed.aiText || "",
    };
  } catch (err) {
    console.error("Groq AI error:", err);
    throw err;
  }
}
