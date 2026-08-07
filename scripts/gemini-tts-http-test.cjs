// Test Gemini TTS via HTTP using generationConfig (legacy endpoint style)
const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");

const env = fs.readFileSync("C:/Users/GURU/Downloads/chatpatti-baddie/.env.local", "utf8");
const apiKey = env.match(/GEMINI_API_KEY=(\S+)/)[1];

const model = "gemini-2.5-flash-preview-tts";

function call(bodyObj, useV1) {
  return new Promise((resolve) => {
    const body = JSON.stringify(bodyObj);
    const v = useV1 ? "v1" : "v1beta";
    const url = `https://generativelanguage.googleapis.com/${v}/models/${model}:generateContent?key=${apiKey}`;
    const req = https.request(url, { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } }, (r) => {
      let b = "";
      r.on("data", (c) => (b += c));
      r.on("end", () => {
        console.log(`${useV1 ? "v1" : "vbeta"} status:`, r.statusCode);
        if (r.statusCode !== 200) {
          console.log("body:", b.slice(0, 700));
          resolve(null);
          return;
        }
        try {
          const j = JSON.parse(b);
          const parts = j.candidates[0].content.parts;
          console.log("parts:", parts.map((p) => (p.text ? `text:${p.text.slice(0,30)}` : `audio:${(p.inlineData && p.inlineData.data.length)/1000|0}KB`)).join(" | "));
          const audio = parts.find((p) => p.inlineData);
          if (audio) {
            const buf = Buffer.from(audio.inlineData.data, "base64");
            console.log("mime:", audio.inlineData.mimeType, "bytes:", buf.length);
            const dir = path.join(os.tmpdir(), "opencode", "tts");
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, `gemini_${useV1 ? "v1" : "vbeta"}.wav`), buf);
            console.log("saved");
            resolve(buf);
          } else resolve(null);
        } catch (e) {
          console.log("parse err", e.message, b.slice(0, 500));
          resolve(null);
        }
      });
    });
    req.on("error", (e) => { console.log("ERR", e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

const bodyObj = {
  contents: [
    {
      role: "user",
      parts: [{ text: "Namaste! Main hoon Haneul, aapka dost. Aap kaise hain?" }],
    },
  ],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: "Kore" },
      },
    },
  },
};

(async () => {
  const t0 = Date.now();
  await call(bodyObj, false);
  console.log("beta done in", Date.now() - t0, "ms");
})();
