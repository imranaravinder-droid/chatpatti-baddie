import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "screenshots");
import { mkdir } from "fs/promises";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 240, height: 240 }, deviceScaleFactor: 2 });

const html = `<!DOCTYPE html>
<html><body style="margin:0;width:240px;height:240px;background:linear-gradient(135deg,#ff6b9d,#c44dff,#6b5bff);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;overflow:hidden;">
  <div style="font-size:64px;line-height:1;margin-bottom:4px;">💬🔥</div>
  <div style="font-size:20px;font-weight:bold;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.3);letter-spacing:1px;">CHATPATTI</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.9);margin-top:2px;letter-spacing:2px;">BADDIE</div>
  <div style="font-size:9px;color:rgba(255,255,255,0.6);margin-top:6px;">AI EMOTIONAL COMPANION</div>
  <div style="font-size:8px;color:rgba(255,255,255,0.4);margin-top:3px;">24 Indian Languages</div>
</body></html>`;

await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, "thumbnail.png") });
console.log("Thumbnail created!");

// Also create gallery images (wider)
const galleryViews = [
  { name: "gallery-signup.png", width: 800, height: 600, bg: "linear-gradient(135deg,#667eea,#764ba2)", text: "💕 Join Chatpatti Baddie", sub: "Sign up & start venting" },
  { name: "gallery-chat.png", width: 800, height: 600, bg: "linear-gradient(135deg,#f093fb,#f5576c)", text: "💬 Vent in 24 Languages", sub: "Hindi, Tamil, Bengali & more" },
  { name: "gallery-modes.png", width: 800, height: 600, bg: "linear-gradient(135deg,#4facfe,#00f2fe)", text: "⚔️❤️😂💬 4 Modes", sub: "Casual · Debate · Comedy · Romance" },
];

for (const g of galleryViews) {
  const p = await browser.newPage({ viewport: { width: g.width, height: g.height }, deviceScaleFactor: 2 });
  const h = `<!DOCTYPE html><html><body style="margin:0;width:${g.width}px;height:${g.height}px;background:${g.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;">
    <div style="font-size:72px;margin-bottom:10px;">😤💕</div>
    <div style="font-size:36px;font-weight:bold;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.3);">${g.text}</div>
    <div style="font-size:20px;color:rgba(255,255,255,0.85);margin-top:6px;">${g.sub}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:20px;">chatpatti-baddie.vercel.app</div>
  </body></html>`;
  await p.setContent(h, { waitUntil: "networkidle" });
  await p.screenshot({ path: path.join(outDir, g.name) });
  await p.close();
  console.log(`${g.name} created!`);
}

await browser.close();
console.log("All gallery images done!");
