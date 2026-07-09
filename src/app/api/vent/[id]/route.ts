import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { booksByMood, recipesByMood } from "@/lib/mockData";

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
          songLyrics: v.songLyrics,
          danceSteps: v.danceSteps as string[],
          books: booksByMood[v.moodTag] || booksByMood.Healing,
          recipes: recipesByMood[v.moodTag] || recipesByMood.Healing,
        },
        createdAt: v.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Vent detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch vent" }, { status: 500 });
  }
}
