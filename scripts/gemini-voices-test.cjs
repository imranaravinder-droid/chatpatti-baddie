// Test Gemini 3.1 TTS preview model with male voice Kore
const fs = require("fs");
const https = require("https");
const path = require("path");
const os = require("os");

const env = fs.readFileSync("C:/Users/GURU/Downloads/chatpatti-baddie/.env.local", "utf8");
const key = env.match(/GEMINI_API_KEY=(\S+)/)[1];

function call(model, voice) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Namaste! Main hoon Haneul, aapka dost. Aap kaise hain?" }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let b = "";
        res.on("data", (c) => (b += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(b);
            const parts = j.candidates[0].content.parts;
            const a = parts.find((p) => p.inlineData);
            if (a) {
              const buf = Buffer.from(a.inlineData.data, "base64");
              console.log(model, voice, "->", res.statusCode, "audio bytes:", buf.length, "mime:", a.inlineData.mimeType);
              const dir = path.join(os.tmpdir(), "opencode", "tts");
              fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(path.join(dir, `gemini_${model.split("/").pop()}_${voice}.wav`), buf);
            } else {
              console.log(model, voice, "->", res.statusCode, JSON.stringify(j).slice(0, 200));
            }
          } catch (e) {
            console.log(model, voice, "->", res.statusCode, "parse err", b.slice(0, 300));
          }
          resolve();
        });
      }
    );
    req.on("error", (e) => { console.log(model, "ERR", e.code); resolve(); });
    req.write(body);
    req.end();
  });
}

(async () => {
  const voices = ["Kore", "Puck", "Fret", "Charon"];
  for (const m of ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview"]) {
    for (const v of voices) {
      await call(m, v);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
})();
