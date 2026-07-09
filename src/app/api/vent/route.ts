import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { analyzeVent } from "@/lib/ai";
import {
  songLyricsByMood,
  danceSteps,
  booksByMood,
  recipesByMood,
} from "@/lib/mockData";

function detectMood(content: string): { tag: string; color: string } {
  const lower = content.toLowerCase();
  if (lower.includes("stress") || lower.includes("panic") || lower.includes("exam") || lower.includes("overwhelmed"))
    return { tag: "Stressed", color: "#FF6B6B" };
  if (lower.includes("promotion") || lower.includes("win") || lower.includes("happy") || lower.includes("glowing"))
    return { tag: "Glowing", color: "#FFD93D" };
  if (lower.includes("ex") || lower.includes("breakup") || lower.includes("heartbreak") || lower.includes("alone"))
    return { tag: "Down-Bad", color: "#4D96FF" };
  if (lower.includes("toxic") || lower.includes("betray") || lower.includes("backstab") || lower.includes("furious"))
    return { tag: "Feral", color: "#FF8E53" };
  if (lower.includes("heal") || lower.includes("let go") || lower.includes("growth") || lower.includes("move on"))
    return { tag: "Healing", color: "#69F0AE" };
  if (lower.includes("embarrass") || lower.includes("chaos") || lower.includes("accident"))
    return { tag: "Chaotic", color: "#FF5252" };
  if (lower.includes("miss") || lower.includes("nostalgia") || lower.includes("feel") || lower.includes("sad"))
    return { tag: "In My Feels", color: "#7C4DFF" };
  return { tag: "Unbothered", color: "#6BCB77" };
}

export async function POST(request: NextRequest) {
  try {
    const { content, mode = "comedy" } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Vent content is required" }, { status: 400 });
    }

    let moodTag: string;
    let moodColor: string;
    let realTalk: string;
    let prompts: string[];

    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (hasGemini) {
      try {
        const ai = await analyzeVent(content, mode);
        moodTag = ai.moodTag;
        moodColor = ai.moodColor;
        realTalk = ai.realTalk;
        prompts = ai.prompts;
      } catch {
        const fallback = detectMood(content);
        moodTag = fallback.tag;
        moodColor = fallback.color;
        realTalk = "The Baddie is thinking... but the vibe is clear.";
        prompts = ["What would you tell your best friend?", "What's the first step to fix this?"];
      }
    } else {
      const fallback = detectMood(content);
      moodTag = fallback.tag;
      moodColor = fallback.color;
      realTalk = moodTag === "Stressed" ? "Take a breath. You've survived 100% of your bad days so far."
        : moodTag === "Down-Bad" ? "Heartbreak is just your soul making space for something better."
        : moodTag === "Glowing" ? "You're not just winning — you're making it look easy."
        : moodTag === "Feral" ? "That fire in you? Don't put it out. Aim it."
        : moodTag === "Healing" ? "Healing isn't linear. Some days you're up, some days you're down."
        : moodTag === "Chaotic" ? "Life's a mess and so are you — iconic."
        : moodTag === "In My Feels" ? "Feelings aren't weaknesses — they're your superpower."
        : "You're main character energy. Keep that crown straight.";
      prompts = mode === "debate"
        ? ["What would you tell your best friend?", "If you could change one thing, what?"]
        : mode === "comedy"
        ? ["On a scale from 'it's fine' to 'I'm feral', where are we?", "What would your confessional say?"]
        : ["What's the one thing you need to hear?", "What would you tell yourself with love?"];
    }

    const result = await db
      .insert(vents)
      .values({
        content,
        mode,
        moodTag,
        moodColor,
        realTalk,
        prompts,
        songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
        danceSteps: danceSteps.slice(0, 4),
      })
      .returning();

    const inserted = result[0];

    return NextResponse.json({
      vent: {
        id: inserted.id.toString(),
        content: inserted.content,
        mode: inserted.mode,
        response: {
          moodTag: inserted.moodTag,
          moodColor: inserted.moodColor,
          realTalk: inserted.realTalk,
          prompts: inserted.prompts as string[],
          songLyrics: inserted.songLyrics,
          danceSteps: inserted.danceSteps as string[],
          books: booksByMood[moodTag] || booksByMood.Healing,
          recipes: recipesByMood[moodTag] || recipesByMood.Healing,
        },
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Vent API error:", error);
    return NextResponse.json({ error: "Failed to save vent" }, { status: 500 });
  }
}
