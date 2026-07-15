import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { eq } from "drizzle-orm";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid vent ID" }, { status: 400 });
    }

    const rows = await db.select().from(vents).where(eq(vents.id, numId)).limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Vent not found" }, { status: 404 });
    }

    const v = rows[0];
    const content = v.aiText && v.aiText.length > 50 && !v.aiText.includes("The Baddie is listening")
      ? { songLyrics: null, songVideoId: null, danceSteps: null, books: null, recipes: null }
      : getContentForMood(v.moodTag);
    return NextResponse.json({
      vent: {
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
      },
    });
  } catch (error) {
    console.error("Vent detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch vent" }, { status: 500 });
  }
}
