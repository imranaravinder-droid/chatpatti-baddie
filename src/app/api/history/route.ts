import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { booksByMood, recipesByMood } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);

    const rows = await db
      .select()
      .from(vents)
      .orderBy(desc(vents.createdAt))
      .limit(limit);

    const formatted = rows.map((v) => ({
      id: v.id.toString(),
      content: v.content,
      mode: v.mode,
      response: {
        moodTag: v.moodTag,
        moodColor: v.moodColor,
        realTalk: v.realTalk,
        prompts: v.prompts as string[],
        songLyrics: v.songLyrics,
        danceSteps: v.danceSteps as string[],
        books: booksByMood[v.moodTag] || booksByMood.Healing,
        recipes: recipesByMood[v.moodTag] || recipesByMood.Healing,
      },
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({ vents: formatted });
  } catch (error) {
    console.error("History API error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
