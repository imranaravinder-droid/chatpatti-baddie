import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "screenshots");
await mkdir(outDir, { recursive: true });

const base = "https://chatpatti-baddie.vercel.app";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

const page = await context.newPage();

// 1. Homepage (signup form)
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(outDir, "01-homepage.png"), fullPage: true });
console.log("1/6 Homepage done");

// 2. Fill form and go to chat
await page.evaluate(() => {
  // Set localStorage so signup is "done"
  localStorage.setItem("baddie_user_email", "priya@demo.com");
  localStorage.setItem("baddie_user_name", "Priya");
});
await page.goto(`${base}/chat`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(outDir, "02-chat-casual.png"), fullPage: true });
console.log("2/6 Chat casual done");

// 3. Romance mode
const romanceBtn = page.locator('button:has-text("Romance")');
if (await romanceBtn.isVisible()) await romanceBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "03-romance-mode.png"), fullPage: true });
console.log("3/6 Romance done");

// 4. Debate mode
const debateBtn = page.locator('button:has-text("Debate")');
if (await debateBtn.isVisible()) await debateBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "04-debate-mode.png"), fullPage: true });
console.log("4/6 Debate done");

// 5. Dashboard
await page.goto(`${base}/dashboard`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(outDir, "05-dashboard.png"), fullPage: true });
console.log("5/6 Dashboard done");

// 6. Language dropdown (on homepage)
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
// Click language button
const langBtn = page.locator('button:has-text("English"), button:has-text("हिन्दी"), button:has-text("বাংলা"), button.language-selector');
const firstLangBtn = langBtn.first();
if (await firstLangBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  await firstLangBtn.click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: path.join(outDir, "06-languages.png"), fullPage: true });
console.log("6/6 Languages done");

await browser.close();
console.log("All screenshots saved to public/screenshots/");
