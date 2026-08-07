// Identify female vs male Gemini TTS voices by generating a tiny sample
const fs = require("fs");
const https = require("https");
const path = require("path");
const os = require("os");

const env = fs.readFileSync("C:/Users/GURU/Downloads/chatpatti-baddie/.env.local", "utf8");
const key = env.match(/GEMINI_API_KEY=(\S+)/)[1];
const model = "gemini-2.5-flash-preview-tts";

// Known Gemini TTS voice names (lowercase). Some are female-coded, some male.
const voices = ["kore", "puck", "charon", "fenrir", "orus", "alnilam", "achernar", "algenib", "iapetus", "leda", "sirius"];

function call(voice) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Hi I am a test" }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let b = ""; res.on("data", (c) => (b += c)); res.on("end", () => {
          try {
            const j = JSON.parse(b);
            const parts = j.candidates?.[0]?.content?.parts || [];
            const a = parts.find((p) => p.inlineData);
            if (a) {
              const buf = Buffer.from(a.inlineData.data, "base64");
              const dir = path.join(os.tmpdir(), "opencode", "tts", "gvoices");
              fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(path.join(dir, voice + ".wav"), buf);
              console.log(`${voice}: OK ${buf.length} bytes`);
            } else {
              console.log(`${voice}: ${res.statusCode} ${JSON.stringify(j).slice(0, 120)}`);
            }
          } catch (e) { console.log(`${voice}: parse err ${b.slice(0, 120)}`); }
          resolve();
        });
      }
    );
    req.on("error", (e) => { console.log(`${voice}: ERR ${e.code}`); resolve(); });
    req.write(body); req.end();
  });
}

(async () => { for (const v of voices) { await call(v); } })();
