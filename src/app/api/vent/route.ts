import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import {
  songLyricsByMood,
  danceSteps,
  booksByMood,
  recipesByMood,
} from "@/lib/mockData";

function detectMood(content: string): { tag: string; color: string } {
  const lower = content.toLowerCase();
  if (
    lower.includes("stress") ||
    lower.includes("panic") ||
    lower.includes("exam") ||
    lower.includes("overwhelmed")
  )
    return { tag: "Stressed", color: "#FF6B6B" };
  if (
    lower.includes("promotion") ||
    lower.includes("win") ||
    lower.includes("happy") ||
    lower.includes("glowing") ||
    lower.includes("good")
  )
    return { tag: "Glowing", color: "#FFD93D" };
  if (
    lower.includes("ex") ||
    lower.includes("breakup") ||
    lower.includes("heartbreak") ||
    lower.includes("alone") ||
    lower.includes("cry")
  )
    return { tag: "Down-Bad", color: "#4D96FF" };
  if (
    lower.includes("toxic") ||
    lower.includes("betray") ||
    lower.includes("backstab") ||
    lower.includes("anger") ||
    lower.includes("furious")
  )
    return { tag: "Feral", color: "#FF8E53" };
  if (
    lower.includes("heal") ||
    lower.includes("let go") ||
    lower.includes("free") ||
    lower.includes("growth") ||
    lower.includes("move on")
  )
    return { tag: "Healing", color: "#69F0AE" };
  if (
    lower.includes("embarrass") ||
    lower.includes("chaos") ||
    lower.includes("mess") ||
    lower.includes("accident")
  )
    return { tag: "Chaotic", color: "#FF5252" };
  if (
    lower.includes("miss") ||
    lower.includes("nostalgia") ||
    lower.includes("feel") ||
    lower.includes("sad")
  )
    return { tag: "In My Feels", color: "#7C4DFF" };
  return { tag: "Unbothered", color: "#6BCB77" };
}

const realTalks: Record<string, string> = {
  Stressed: "Take a breath. You've survived 100% of your bad days so far. This is just another one you're going to crush.",
  "Down-Bad": "Heartbreak is just your soul making space for something better. Feel it, then flip it.",
  Glowing: "You're not just winning — you're making it look easy. Keep that energy, the world is yours.",
  Feral: "That fire in you? Don't put it out. Aim it. Channel it. Make them remember your name.",
  "In My Feels": "Feelings aren't weaknesses — they're your superpower. Let yourself feel and then let it go.",
  Chaotic: "Life's a mess and so are you — and that's exactly what makes you iconic. Embrace the chaos.",
  Healing: "Healing isn't linear. Some days you're up, some days you're down. Both are progress.",
  Unbothered: "You're main character energy and everyone else is just an extra. Keep that crown straight.",
};

const promptSets: Record<string, string[]> = {
  debate: [
    "What would you tell your best friend if they were in this exact situation?",
    "If you had the power to change one thing right now, what would it be?",
  ],
  comedy: [
    "On a scale from 'it's fine' to 'I'm feral', where are we right now?",
    "If this was a reality TV show, what would your confessional line be?",
  ],
  romance: [
    "What's the one thing you need to hear right now? Be honest.",
    "If you stepped outside yourself, what would you tell yourself with love?",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { content, mode = "comedy" } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Vent content is required" }, { status: 400 });
    }

    const mood = detectMood(content);
    const realTalk = realTalks[mood.tag] || realTalks.Unbothered;
    const prompts = promptSets[mode as keyof typeof promptSets] || promptSets.comedy;

    const result = await db
      .insert(vents)
      .values({
        content,
        mode,
        moodTag: mood.tag,
        moodColor: mood.color,
        realTalk,
        prompts,
        songLyrics: songLyricsByMood[mood.tag] || songLyricsByMood.Glowing,
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
          books: booksByMood[mood.tag] || booksByMood.Healing,
          recipes: recipesByMood[mood.tag] || recipesByMood.Healing,
        },
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Vent API error:", error);
    return NextResponse.json({ error: "Failed to save vent" }, { status: 500 });
  }
}
