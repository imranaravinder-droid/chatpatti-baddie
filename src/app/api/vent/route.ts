import { NextRequest, NextResponse } from "next/server";
import { sampleVents, songLyricsByMood, danceSteps, booksByMood, recipesByMood } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const { content, mode } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Vent content is required" }, { status: 400 });
    }

    const randomVent = sampleVents[Math.floor(Math.random() * sampleVents.length)];
    const moodTag = randomVent.response.moodTag;

    let prompts: string[];
    if (mode === "debate") {
      prompts = [
        "Oh really? And what's YOUR evidence for that logic?",
        "If your best friend told you this, what would YOU say to them?",
      ];
    } else if (mode === "comedy") {
      prompts = [
        "On a scale from 'it's fine' to 'I'm feral', where are we right now?",
        "If this was a reality TV show, what would the confessional say?",
      ];
    } else {
      prompts = [
        "What's the one thing you need to hear right now?",
        "If you could step outside yourself, what would you tell yourself?",
      ];
    }

    const response = {
      moodTag,
      moodColor: randomVent.response.moodColor,
      realTalk: randomVent.response.realTalk,
      prompts,
      songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
      danceSteps: danceSteps.slice(0, 4),
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
