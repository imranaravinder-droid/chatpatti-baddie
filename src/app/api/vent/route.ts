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

function detectIntent(content: string, mode: string): string {
  const lower = content.toLowerCase();
  const wantsSong = lower.includes("song") || lower.includes("lyric") || lower.includes("music") || lower.includes("sing") || lower.includes("beat");
  const wantsDance = lower.includes("dance") || lower.includes("step") || lower.includes("move") || lower.includes("shake") || lower.includes("groove");
  const wantsComedy = lower.includes("laugh") || lower.includes("funny") || lower.includes("joke") || lower.includes("roast") || lower.includes("comedy") || lower.includes("hilarious");
  const wantsShayari = lower.includes("poem") || lower.includes("poetry") || lower.includes("shayari") || lower.includes("soothe") || lower.includes("romantic") || lower.includes("love");
  const wantsRecipe = lower.includes("recipe") || lower.includes("cook") || lower.includes("food") || lower.includes("eat") || lower.includes("bake") || lower.includes("snack");
  const wantsBook = lower.includes("book") || lower.includes("read") || lower.includes("novel") || lower.includes("recommend");

  if (wantsSong) {
    if (mode === "debate") return "Here's a power anthem for you:\n\n[Verse]\nThey said I couldn't, I said watch me\nBuilt my empire from the ground up, you see?\nEvery doubt just fueled the flame\nNow they whisper my name in the hall of fame.\n\n[Chorus]\nI'm not just winning, I'm taking over\nWatch me rise like a four-leaf clover.\n";
    if (mode === "romance") return "A melody for your heart:\n\n[Verse]\nSoft as the moonlight on your skin\nYour heart beats a rhythm I want to be in\nEvery scar tells a story of grace\nLet me trace the love on your face.\n\n[Chorus]\nYou're not broken, you're just healing\nEvery feeling has a meaning.\n";
    return "[Verse]\nLife threw shade, I threw glitter back\nEvery attack just added to my stack\nOf comebacks and glow-ups, watch me shine\nI'm a whole vibe, one of a kind.\n\n[Chorus]\nCan't dim this light, no matter how you try\nI'm the main character, this is my sky.\n";
  }

  if (wantsDance) {
    return "Step 1: Roll your shoulders back 4x. Drop the tension.\nStep 2: Sway left slow & sassy — like you're walking past your haters.\nStep 3: Snap twice, point to the sky. Call down good vibes.\nStep 4: Two-step right — slide, slide, stop. Hair flip for drama.\nStep 5: Spin once, strike a power pose. You're that person.";
  }

  if (wantsComedy) {
    return "Scene: Your life, directed by you.\n\n*You walk in slow motion*\nBaddie Narrator: 'And in this episode of \"How to be iconic while falling apart\"...'\nYou: 'I'm fine.'\n*Camera zooms in on your lying face*\nAudience: *laugh track*\nBaddie Narrator: 'She's not fine. But she's fabulous.'\n\nCut to credits. You're the star.";
  }

  if (wantsShayari && mode === "romance") {
    return "Dil ke kone mein jo dard chhupa hai,\nWoh bhi kabhi apni baat kahayega.\nToote huye sheeshe ki tarah ho tum,\nPhir bhi roshni bikherte ho har pal.\n\nThoda aur waqt de apne aap ko,\nBaddie hai na jo tham lega tumhe.\nHar zakhm se kuch seekh lo,\nPhir se khilna seekho, phir se jee lo.";
  }

  if (wantsRecipe) {
    if (mode === "romance") return "🍫 Heart-Healing Hot Chocolate\n\nIngredients: milk, dark chocolate, honey, cinnamon, a pinch of love\n\n1. Warm milk slowly — like patience\n2. Break chocolate into pieces — let them melt\n3. Add honey and cinnamon\n4. Stir with intention\n5. Sip slowly. Let it warm your soul.";
    return "🍪 90-Second Stress Cookie\n\nIngredients: 3 tbsp flour, 2 tbsp sugar, 2 tbsp butter, chocolate chips\n\n1. Mix everything in a mug\n2. Microwave 45 sec\n3. Eat with zero shame\n4. Repeat if necessary.";
  }

  if (wantsBook) {
    return "📖 For your mood, try this:\n\nTitle: \"The Art of Not Forcing It\"\nWhy: Because you're trying too hard to control everything. Let the story unfold.";
  }

  return "";
}

function getContentForMood(moodTag: string) {
  const moodLower = moodTag.toLowerCase();
  if (moodLower === "glowing" || moodLower === "unbothered") {
    return {
      songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
      danceSteps: danceSteps.slice(0, 4),
      books: null,
      recipes: null,
    };
  }
  if (moodLower === "down-bad" || moodLower === "in my feels") {
    return {
      songLyrics: songLyricsByMood[moodTag] || songLyricsByMood["Down-Bad"],
      danceSteps: null,
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: null,
    };
  }
  if (moodLower === "feral") {
    return {
      songLyrics: null,
      danceSteps: danceSteps.slice(2, 6),
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  if (moodLower === "chaotic") {
    return {
      songLyrics: null,
      danceSteps: danceSteps.slice(0, 4),
      books: null,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  if (moodLower === "healing") {
    return {
      songLyrics: null,
      danceSteps: null,
      books: booksByMood[moodTag] || booksByMood.Healing,
      recipes: recipesByMood[moodTag] || recipesByMood.Healing,
    };
  }
  return {
    songLyrics: songLyricsByMood[moodTag] || songLyricsByMood.Glowing,
    danceSteps: null,
    books: null,
    recipes: recipesByMood[moodTag] || recipesByMood.Healing,
  };
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
    let aiText: string = "";

    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (hasGemini) {
      try {
        const ai = await analyzeVent(content, mode);
        moodTag = ai.moodTag;
        moodColor = ai.moodColor;
        realTalk = ai.realTalk;
        prompts = ai.prompts;
        aiText = ai.aiText || detectIntent(content, mode);
      } catch {
        const fallback = detectMood(content);
        moodTag = fallback.tag;
        moodColor = fallback.color;
        realTalk = "The Baddie is processing... vibe detected.";
        prompts = ["What would you tell your best friend?", "What's the first step to fix this?"];
        aiText = detectIntent(content, mode);
      }
    } else {
      const fallback = detectMood(content);
      moodTag = fallback.tag;
      moodColor = fallback.color;
      if (mode === "debate") {
        realTalk = moodTag === "Stressed" ? "You're stressed? Good. Stress means you care. Now channel it before it eats you alive."
          : moodTag === "Down-Bad" ? "They left. So what? Their loss. Stop giving them free rent in your head."
          : moodTag === "Glowing" ? "You're winning? Don't get comfortable. Stay hungry. The moment you relax is when they catch up."
          : moodTag === "Feral" ? "Good. Be angry. Now use it. Anger is fuel — burn something productive."
          : moodTag === "Healing" ? "Healing isn't soft. It's war. Every day you choose yourself is a battle won."
          : moodTag === "Chaotic" ? "Chaos is your brand. Own it. But don't let it own you."
          : moodTag === "In My Feels" ? "Feelings are data, not destiny. Analyze them and move on."
          : "You're unbothered? Prove it. Actions speak louder than vibes.";
        prompts = ["What's the real issue you're avoiding?", "If you had 30 seconds to say the truth, what would it be?"];
        aiText = "You wanted the truth? Here it is. You've been playing small, making excuses, and blaming the world. News flash: nobody's coming to save you. That fire you feel? That's not anger — that's your potential begging to be unleashed. So either step up or step aside. The Baddie doesn't do pity parties.";
      } else if (mode === "comedy") {
        realTalk = moodTag === "Stressed" ? "Bestie, you're stressed? That's just your brain's dramatic era."
          : moodTag === "Down-Bad" ? "Heartbreak is just your villain origin story. Every queen needs one."
          : moodTag === "Glowing" ? "You're glowing so hard I need sunglasses. Save some confidence for the rest of us."
          : moodTag === "Feral" ? "Feral is just passionate with bad PR. You're iconic."
          : moodTag === "Healing" ? "Healing looks good on you. It's giving 'main character in their growth era'."
          : moodTag === "Chaotic" ? "Chaotic? Same. We love a messy legend."
          : moodTag === "In My Feels" ? "In your feels? That's just your monthly subscription to emotions."
          : "Unbothered, moisturized, thriving — we love to see it.";
        prompts = ["On a scale from 'it's fine' to 'I'm feral', where are we?", "What would your reality TV confessional say right now?"];
        aiText = "Scene: You, walking into the room like you own it. (Because you do.) \n\n*Dramatic reenactment* \nYou: 'I'm fine.' \nEveryone: 'Bestie, we saw the whole thing.' \nYou: '...Okay maybe I'm not fine.' \nEveryone: 'We know. That's why we brought snacks.' \n\nCut to credits. Roll laughter.";
      } else {
        realTalk = moodTag === "Stressed" ? "Take a breath, love. You've carried so much. Let me hold some of it for a moment."
          : moodTag === "Down-Bad" ? "Your heart is healing. Be gentle with it. You deserve the love you're longing for."
          : moodTag === "Glowing" ? "You're radiant. Don't dim yourself for anyone. Shine unapologetically."
          : moodTag === "Feral" ? "I see the fire in you. Let's turn it into warmth instead of ash."
          : moodTag === "Healing" ? "Healing is a love story between you and yourself. Take all the time you need."
          : moodTag === "Chaotic" ? "I see the mess. Let's untangle it together, one thread at a time."
          : moodTag === "In My Feels" ? "Your feelings are valid. Let them flow through you like a gentle wave."
          : "You are enough. Exactly as you are. Don't let anyone tell you otherwise.";
        prompts = ["What does your heart need right now?", "If love was the answer, what would you ask?"];
      }
      const intentText = detectIntent(content, mode);
      if (intentText) {
        aiText = intentText;
      } else if (!aiText) {
        aiText = mode === "debate" ? "You wanted the truth? Here it is. You've been playing small, making excuses, and blaming the world. News flash: nobody's coming to save you. That fire you feel? That's not anger — that's your potential begging to be unleashed. So either step up or step aside. The Baddie doesn't do pity parties."
          : mode === "comedy" ? "Scene: You, walking into the room like you own it. (Because you do.) \n\n*Dramatic reenactment* \nYou: 'I'm fine.' \nEveryone: 'Bestie, we saw the whole thing.' \nYou: '...Okay maybe I'm not fine.' \nEveryone: 'We know. That's why we brought snacks.' \n\nCut to credits. Roll laughter."
          : "Tumhare chehre ki wo udaasi, \nJaane kyun mujhse dekhi nahi jaati. \nHar baar tum muskuraate ho, \nPar aankhein tumhaari dastaan sunaati hain. \n\nRuk jaao ek pal ke liye, \nYeh dil tumhe ek baat bataye. \nTum tanha nahi ho is duniya mein, \nBaddie hai na jo har baar muskuraye.";
      }
    }

    const contentForMood = getContentForMood(moodTag);
    const hasSpecificRequest = aiText && aiText.length > 0;

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
        songLyrics: hasSpecificRequest ? null : contentForMood.songLyrics,
        danceSteps: hasSpecificRequest ? null : contentForMood.danceSteps,
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
          aiText,
          songLyrics: hasSpecificRequest ? null : inserted.songLyrics,
          danceSteps: hasSpecificRequest ? null : (inserted.danceSteps as string[]),
          books: hasSpecificRequest ? null : contentForMood.books,
          recipes: hasSpecificRequest ? null : contentForMood.recipes,
        },
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Vent API error:", error);
    return NextResponse.json({ error: "Failed to save vent" }, { status: 500 });
  }
}
