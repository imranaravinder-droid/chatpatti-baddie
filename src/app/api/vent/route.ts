import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents, dailyUsage, subscriptions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { analyzeVent } from "@/lib/ai";
import { getConversationalResponse, getIntentResponse } from "@/lib/responses";
import {
  songLyricsByMood,
  songVideoByMood,
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

function getContentForMood(moodTag: string) {
  const videoId = () => songVideoByMood[moodTag] || "H1hL15VdSxQ";
  const moodLower = moodTag.toLowerCase();
  if (moodLower === "glowing" || moodLower === "unbothered") {
    return {
      songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
      songVideoId: videoId(),
      danceSteps: danceSteps.slice(0, 4),
      books: null,
      recipes: null,
    };
  }
  if (moodLower === "down-bad" || moodLower === "in my feels") {
    return {
      songLyrics: songLyricsByMood[moodTag] || songLyricsByMood["Down-Bad"],
      songVideoId: videoId(),
      danceSteps: null,
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: null,
    };
  }
  if (moodLower === "feral") {
    return {
      songLyrics: null,
      songVideoId: null,
      danceSteps: danceSteps.slice(2, 6),
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  if (moodLower === "chaotic") {
    return {
      songLyrics: null,
      songVideoId: null,
      danceSteps: danceSteps.slice(0, 4),
      books: null,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  if (moodLower === "healing") {
    return {
      songLyrics: null,
      songVideoId: null,
      danceSteps: null,
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  return {
    songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
    songVideoId: videoId(),
    danceSteps: null,
    books: null,
    recipes: recipesByMood[moodTag] || recipesByMood.Healing,
  };
}

const realTalkByMode: Record<string, Record<string, string>> = {
  casual: {
    Stressed: "Take a deep breath. You've got this. One thing at a time.",
    "Down-Bad": "Heartbreak is tough. Let yourself feel it, but don't stay there forever.",
    Glowing: "Love that energy! Keep that momentum going.",
    Feral: "Feel the rage. Then let it go. Holding on only hurts you.",
    Healing: "Healing isn't linear. Be patient with yourself.",
    Chaotic: "Life feels chaotic right now. That's okay — just breathe through it.",
    "In My Feels": "It's okay to sit with your feelings. They'll pass.",
    catchall: "I'm here for you. What's on your mind?",
  },
  debate: {
    Stressed: "You're stressed? Good. Stress means you care. Now channel it before it eats you alive.",
    "Down-Bad": "They left. So what? Their loss. Stop giving them free rent in your head.",
    Glowing: "You're winning? Don't get comfortable. Stay hungry. The moment you relax is when they catch up.",
    Feral: "Good. Be angry. Now use it. Anger is fuel — burn something productive.",
    Healing: "Healing isn't soft. It's war. Every day you choose yourself is a battle won.",
    Chaotic: "Chaos is your brand. Own it. But don't let it own you.",
    "In My Feels": "Feelings are data, not destiny. Analyze them and move on.",
    catchall: "You're unbothered? Prove it. Actions speak louder than vibes.",
  },
  comedy: {
    Stressed: "Bestie, you're stressed? That's just your brain's dramatic era.",
    "Down-Bad": "Heartbreak is just your villain origin story. Every queen needs one.",
    Glowing: "You're glowing so hard I need sunglasses. Save some confidence for the rest of us.",
    Feral: "Feral is just passionate with bad PR. You're iconic.",
    Healing: "Healing looks good on you. It's giving 'main character in their growth era'.",
    Chaotic: "Chaotic? Same. We love a messy legend.",
    "In My Feels": "In your feels? That's just your monthly subscription to emotions.",
    catchall: "Unbothered, moisturized, thriving — we love to see it.",
  },
  romance: {
    Stressed: "Take a breath, love. You've carried so much. Let me hold some of it for a moment.",
    "Down-Bad": "Your heart is healing. Be gentle with it. You deserve the love you're longing for.",
    Glowing: "You're radiant. Don't dim yourself for anyone. Shine unapologetically.",
    Feral: "I see the fire in you. Let's turn it into warmth instead of ash.",
    Healing: "Healing is a love story between you and yourself. Take all the time you need.",
    Chaotic: "I see the mess. Let's untangle it together, one thread at a time.",
    "In My Feels": "Your feelings are valid. Let them flow through you like a gentle wave.",
    catchall: "You are enough. Exactly as you are. Don't let anyone tell you otherwise.",
  },
};

const promptsByMode: Record<string, string[]> = {
  casual: ["How are you feeling about all this?", "What do you think would help right now?"],
  debate: ["What's the real issue you're avoiding?", "If you had 30 seconds to say the truth, what would it be?"],
  comedy: ["On a scale from 'it's fine' to 'I'm feral', where are we?", "What would your reality TV confessional say right now?"],
  romance: ["What does your heart need right now?", "If love was the answer, what would you ask?"],
};

export async function POST(request: NextRequest) {
  try {
    const { content, mode = "comedy", lang = "en", deviceId } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Vent content is required" }, { status: 400 });
    }

    if (deviceId) {
      const sub = await db.select().from(subscriptions).where(eq(subscriptions.deviceId, deviceId)).limit(1);
      const isPremium = sub.length > 0 && sub[0].status === "active" && (!sub[0].expiresAt || new Date(sub[0].expiresAt) > new Date());
      if (!isPremium) {
        const today = new Date().toISOString().slice(0, 10);
        const usage = await db.select().from(dailyUsage).where(and(eq(dailyUsage.deviceId, deviceId), eq(dailyUsage.date, today))).limit(1);
        const count = usage.length > 0 ? usage[0].count : 0;
        if (count >= 5) {
          return NextResponse.json({ error: "Daily free limit reached. Upgrade for unlimited vents.", premium: false }, { status: 429 });
        }
      }
    }

    let moodTag: string;
    let moodColor: string;
    let realTalk: string;
    let prompts: string[];
    let aiText: string = "";

    const hasAI = !!process.env.GROQ_API_KEY || !!process.env.GEMINI_API_KEY;

    if (hasAI) {
      try {
        const ai = await analyzeVent(content, mode, lang);
        moodTag = ai.moodTag;
        moodColor = ai.moodColor;
        realTalk = ai.realTalk;
        prompts = ai.prompts;
        aiText = ai.aiText || getIntentResponse(content, mode) || getConversationalResponse(content, mode);
      } catch {
        const fallback = detectMood(content);
        moodTag = fallback.tag;
        moodColor = fallback.color;
        const talkMap = realTalkByMode[mode] || realTalkByMode.comedy;
        realTalk = talkMap[moodTag as keyof typeof talkMap] || talkMap.catchall || "The Baddie is listening...";
        prompts = promptsByMode[mode] || promptsByMode.comedy;
        aiText = getIntentResponse(content, mode) || getConversationalResponse(content, mode);
      }
    } else {
      const fallback = detectMood(content);
      moodTag = fallback.tag;
      moodColor = fallback.color;

      const talkMap = realTalkByMode[mode] || realTalkByMode.comedy;
      realTalk = talkMap[moodTag as keyof typeof talkMap] || talkMap.catchall || "The Baddie is listening...";
      prompts = promptsByMode[mode] || promptsByMode.comedy;
      aiText = getIntentResponse(content, mode) || getConversationalResponse(content, mode);
    }

    const contentForMood = getContentForMood(moodTag);

    const result = await db
      .insert(vents)
      .values({
        content,
        mode,
        moodTag,
        moodColor,
        realTalk,
        prompts,
        aiText,
        songLyrics: contentForMood.songLyrics,
        danceSteps: contentForMood.danceSteps,
      })
      .returning();

    const inserted = result[0];

    if (deviceId) {
      const sub = await db.select().from(subscriptions).where(eq(subscriptions.deviceId, deviceId)).limit(1);
      const isPremium = sub.length > 0 && sub[0].status === "active" && (!sub[0].expiresAt || new Date(sub[0].expiresAt) > new Date());
      if (!isPremium) {
        const today = new Date().toISOString().slice(0, 10);
        const existing = await db.select().from(dailyUsage).where(and(eq(dailyUsage.deviceId, deviceId), eq(dailyUsage.date, today))).limit(1);
        if (existing.length > 0) {
          await db.update(dailyUsage).set({ count: existing[0].count + 1 }).where(eq(dailyUsage.id, existing[0].id));
        } else {
          await db.insert(dailyUsage).values({ deviceId, date: today, count: 1 });
        }
      }
    }

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
          aiText,
          songLyrics: inserted.songLyrics,
          songVideoId: contentForMood.songVideoId,
          danceSteps: inserted.danceSteps,
          books: contentForMood.books,
          recipes: contentForMood.recipes,
        },
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Vent API error:", error);
    return NextResponse.json({ error: "Failed to save vent" }, { status: 500 });
  }
}
