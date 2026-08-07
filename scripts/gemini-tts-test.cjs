// Test Gemini TTS with male voice Kore - run from project root
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env.local");
let apiKey = process.env.GEMINI_API_KEY;
if (fs.existsSync(envPath)) {
  const s = fs.readFileSync(envPath, "utf8");
  const m = s.match(/GEMINI_API_KEY=(\S+)/);
  if (m && !apiKey) apiKey = m[1];
}
if (!apiKey) apiKey = process.env.GEMINI_API_KEY;

console.log("Has key:", !!apiKey);

(async () => {
  try {
    const { GoogleGenAI, Modality } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const t0 = Date.now();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: "Hello! I am Haneul, your friendly AI assistant. How can I help you today?",
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore",
            },
          },
        },
      },
    });

    console.log("gen latency:", Date.now() - t0, "ms");
    const parts = response.candidates[0].content.parts;
    console.log(
      "parts:",
      parts.map(p =>
        p.text
          ? "text:" + p.text.slice(0, 30)
          : "audio:" + (p.inlineData ? (p.inlineData.data?.length || 0) + " b64 chars" : "no data")
      ).join(", ")
    );
    const audioPart = parts.find(p => p.inlineData);
    if (audioPart) {
      const b64 = audioPart.inlineData.data;
      const mime = audioPart.inlineData.mimeType || "audio/wav";
      console.log("mime:", mime);
      const buf = Buffer.from(b64, "base64");
      const dir = path.join(require("os").tmpdir(), "opencode", "tts");
      fs.mkdirSync(dir, { recursive: true });
      const out = path.join(dir, "gemini_kore.wav");
      fs.writeFileSync(out, buf);
      console.log("wrote", out, "bytes:", buf.length);
    } else {
      console.log("NO AUDIO. Full response:", JSON.stringify(response).slice(0, 600));
    }
  } catch (e) {
    console.log("ERR", e.message);
    console.log(e.stack);
  }
})();
