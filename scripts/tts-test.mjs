import { EdgeTTS } from "msedge-tts";

const tts = new EdgeTTS();
await tts.init();
const audio = await tts.toStream("Hello beta, kaise ho aap? Main yahan hoon aapki madad ke liye.", {
  voice: "hi-IN-MadhurNeural",
  rate: 0,
  volume: 0,
  pitch: 0,
});
const chunks = [];
for await (const c of audio.stream) chunks.push(Buffer.from(c));
const buf = Buffer.concat(chunks);
require("fs").writeFileSync("C:/Users/GURU/AppData/Local/Temp/opencode/test4.mp3", buf);
console.log("DONE", buf.length);
await tts.close();
