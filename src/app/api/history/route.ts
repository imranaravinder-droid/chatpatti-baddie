import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { booksByMood, recipesByMood, songLyricsByMood, songVideoByMood, danceSteps } from "@/lib/mockData";

function getContentForMood(moodTag: string) {
  const videoId = () => songVideoByMood[moodTag] || null;
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
      songLyrics: songLyricsByMood["Down-Bad"],
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);

    const rows = await db
      .select()
      .from(vents)
      .orderBy(desc(vents.createdAt))
      .limit(limit);

    const formatted = rows.map((v) => {
      const content = getContentForMood(v.moodTag);
      return {
        id: v.id.toString(),
        content: v.content,
        mode: v.mode,
        response: {
          moodTag: v.moodTag,
          moodColor: v.moodColor,
          realTalk: v.realTalk,
          prompts: v.prompts as string[],
          aiText: v.aiText,
          songLyrics: content.songLyrics,
          songVideoId: content.songVideoId,
          danceSteps: content.danceSteps,
          books: content.books,
          recipes: content.recipes,
        },
        createdAt: v.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ vents: formatted });
  } catch (error) {
    console.error("History API error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
