import { Vent, MoodTagColor } from "@/types";

export const moodTagColors: MoodTagColor[] = [
  { tag: "Stressed", color: "#FF6B6B" },
  { tag: "Glowing", color: "#FFD93D" },
  { tag: "Unbothered", color: "#6BCB77" },
  { tag: "Down-Bad", color: "#4D96FF" },
  { tag: "Feral", color: "#FF8E53" },
  { tag: "Main Character", color: "#E040FB" },
  { tag: "Slaying", color: "#FF4081" },
  { tag: "In My Feels", color: "#7C4DFF" },
  { tag: "Chaotic", color: "#FF5252" },
  { tag: "Healing", color: "#69F0AE" },
  { tag: "Villain Arc", color: "#212121" },
  { tag: "Grateful", color: "#FFD740" },
];

export const songLyricsByMood: Record<string, string> = {
  Stressed: `[Verse]
Clock is ticking on the wall
Got that weight that makes me small
Breathing heavy, mind's a mess
Need a break, I must confess

[Chorus]
Let it go, let it flow
Watch the pressure start to slow
You're a queen, you already know
Watch your confidence just grow`,
  "Down-Bad": `[Verse]
Tears on my pillow case
Empty smile upon my face
Thought we had something real
Now I'm learning how to heal

[Chorus]
Heartbreak made me who I am
Stronger now, I give a damn
Pick myself up off the floor
I don't need you anymore`,
  Glowing: `[Verse]
Mirror mirror on the wall
Who's the baddest of them all?
Got that glow from head to toe
Watch me shine, watch me grow

[Chorus]
I'm that girl, can't you see?
Living life so carelessly
Radiating energy
This is how I'm meant to be`,
};

export const danceSteps: string[] = [
  "Step 1: Shake it off! Start by rolling your shoulders back 4 times. Let the tension drop like a bad conversation.",
  "Step 2: Hip sway to the left - slow and sassy. Imagine you're walking past your ex looking flawless. Hold for 2 beats.",
  "Step 3: Snap your fingers twice, then point to the sky. You're calling down good vibes only.",
  "Step 4: Two-step to the right - slide, slide, stop. Add a little hair flip for maximum drama.",
  "Step 5: Spin around once and strike a power pose. Hands on hips, chin up. That's right, you're that person.",
  "Step 6: Knee bounce twice, then stomp your right foot. Release all that built-up frustration into the floor.",
  "Step 7: Wave your arms up like you're letting go of everything that hurt you. Slow and smooth.",
  "Step 8: Final pose - one hand on hip, other hand waving goodbye to all the negativity. Werk!",
];

export const sampleVents: Vent[] = [
  {
    id: "1",
    content:
      "My boyfriend forgot our anniversary again. I literally planned a whole surprise dinner and he showed up with pizza because he 'didn't remember'. I'm so done.",
    mode: "debate",
    response: {
      moodTag: "Down-Bad",
      moodColor: "#4D96FF",
      realTalk:
        "He showed up with pizza while you had a whole five-star spread planned? That's not forgetfulness, that's weaponized incompetence with extra cheese.",
      prompts: [
        "If he remembered his gaming password from 2018, what's really going on with his 'bad memory'?",
        "What would you tell your best friend if she was in this exact situation?",
      ],
      songLyrics: songLyricsByMood["Down-Bad"],
      danceSteps: danceSteps.slice(0, 4),
    },
    createdAt: "2026-07-08T19:30:00Z",
  },
  {
    id: "2",
    content:
      "I GOT THE PROMOTION!! After 3 years of grinding, staying late, and dealing with a manager who didn't believe in me, I finally made Senior!!",
    mode: "comedy",
    response: {
      moodTag: "Glowing",
      moodColor: "#FFD93D",
      realTalk:
        "Three years of slaying and you finally got your crown. Your manager's probably updating their resume after watching you rise.",
      prompts: [
        "What's the first thing you're buying to celebrate this W?",
        "How does it feel to be living rent-free in your manager's head?",
      ],
      songLyrics: songLyricsByMood.Glowing,
      danceSteps: danceSteps.slice(0, 5),
    },
    createdAt: "2026-07-08T14:15:00Z",
  },
  {
    id: "3",
    content:
      "I have three exams back to back tomorrow and I haven't studied anything. I'm panicking. My brain feels empty and I can't stop scrolling through reels.",
    mode: "romance",
    response: {
      moodTag: "Stressed",
      moodColor: "#FF6B6B",
      realTalk:
        "Your brain isn't empty, it's just overwhelmed. Put the phone down, take five deep breaths, and remember you've passed every hard day so far.",
      prompts: [
        "What's the ONE topic you can nail right now? Start there and build momentum.",
        "After these exams, what's the first thing you'll do to treat yourself?",
      ],
      songLyrics: songLyricsByMood.Stressed,
      danceSteps: danceSteps.slice(2, 7),
    },
    createdAt: "2026-07-07T22:45:00Z",
  },
  {
    id: "4",
    content:
      "My best friend copied my entire presentation for our joint meeting and didn't even credit me. Our boss loved her and said I should 'take notes from her'.",
    mode: "debate",
    response: {
      moodTag: "Feral",
      moodColor: "#FF8E53",
      realTalk:
        "She didn't just steal your presentation, she stole your moment and let you get shaded by your boss. That's not a friend, that's a coworker in disguise.",
      prompts: [
        "If you had 30 seconds alone with your boss, what's the one thing you'd say?",
        "What boundary are you setting with this 'friend' starting tomorrow?",
      ],
      songLyrics: songLyricsByMood["Down-Bad"],
      danceSteps: danceSteps.slice(0, 4),
    },
    createdAt: "2026-07-07T11:20:00Z",
  },
  {
    id: "5",
    content:
      "I've been single for 2 years and honestly? I'm thriving. I travel alone, I eat at fancy restaurants alone, I buy myself flowers. But my family keeps asking 'when will you settle down?'",
    mode: "comedy",
    response: {
      moodTag: "Unbothered",
      moodColor: "#6BCB77",
      realTalk:
        "You're out here living your main character era and they're worried about you settling? Ma'am, you're not unsettled, you're ascending.",
      prompts: [
        "Where's the next solo trip you're planning? Give the people (and your family) something to talk about.",
        "What's something you did alone this month that your past relationship-self would never have done?",
      ],
      songLyrics: songLyricsByMood.Glowing,
      danceSteps: danceSteps.slice(3, 8),
    },
    createdAt: "2026-07-06T16:00:00Z",
  },
  {
    id: "6",
    content:
      "I just found out my ex is dating someone new and she's literally an influencer with 50k followers. Why do I feel like I lost even though I was the one who ended things?",
    mode: "romance",
    response: {
      moodTag: "In My Feels",
      moodColor: "#7C4DFF",
      realTalk:
        "You ended things for a reason, and Instagram followers don't change who he is at 3am when the filters come off. Your peace is worth more than a highlight reel.",
      prompts: [
        "What's one thing you've done since the breakup that YOU'RE proud of?",
        "If you could say one thing to your past self the day you ended it, what would it be?",
      ],
      songLyrics: songLyricsByMood["Down-Bad"],
      danceSteps: danceSteps.slice(1, 5),
    },
    createdAt: "2026-07-06T09:30:00Z",
  },
  {
    id: "7",
    content:
      "I finally cut off my toxic best friend of 10 years. She made everything about her, dimmed my light, and got jealous whenever I succeeded. I feel free but also guilty.",
    mode: "romance",
    response: {
      moodTag: "Healing",
      moodColor: "#69F0AE",
      realTalk:
        "You didn't lose a friend, you reclaimed your energy. Ten years is a long time, but the rest of your life is longer - and it's yours now.",
      prompts: [
        "What's one thing you stopped doing because she made you feel bad about it? Time to pick it back up.",
        "How are you going to celebrate your freedom this weekend?",
      ],
      songLyrics: songLyricsByMood.Glowing,
      danceSteps: danceSteps.slice(0, 6),
    },
    createdAt: "2026-07-05T20:15:00Z",
  },
  {
    id: "8",
    content:
      "I accidentally replied 'I love you too' to my boss instead of my mom in the work group chat. Everyone saw it. I want to disappear.",
    mode: "comedy",
    response: {
      moodTag: "Chaotic",
      moodColor: "#FF5252",
      realTalk:
        "You just declared workplace love in the group chat. Either you're getting a raise or an HR meeting, and honestly? Both are iconic in their own way.",
      prompts: [
        "What's your excuse gonna be? 'Auto-correct' or 'I love this company THAT much'?",
        "On a scale of 1 to 'new job', how are you feeling right now?",
      ],
      songLyrics: songLyricsByMood.Stressed,
      danceSteps: danceSteps.slice(2, 6),
    },
    createdAt: "2026-07-05T13:45:00Z",
  },
];

export function getVentById(id: string): Vent | undefined {
  return sampleVents.find((v) => v.id === id);
}

export function getMoodColor(tag: string): string {
  return moodTagColors.find((m) => m.tag === tag)?.color ?? "#888";
}
