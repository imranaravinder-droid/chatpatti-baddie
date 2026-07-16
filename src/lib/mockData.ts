import { Vent, MoodTagColor, BookRec, RecipeRec } from "@/types";

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

export const songVideoByMood: Record<string, string> = {
  Stressed: "WcIG2YxbF6Q",
  "Down-Bad": "kQN7npC-bQo",
  Heartbroken: "kQN7npC-bQo",
  Sad: "kQN7npC-bQo",
  Glowing: "y2ZOqMhG6dM",
  Happy: "y2ZOqMhG6dM",
  Excited: "y2ZOqMhG6dM",
  Feral: "xrEEjR27lqE",
  Angry: "xrEEjR27lqE",
  "In My Feels": "QcNz8WbhSNk",
  Nostalgic: "QcNz8WbhSNk",
  Chaotic: "wXU3npqIQl4",
  Healing: "b8I5cL7Wp20",
  "Main Character": "EWRjLirBqHw",
  Unbothered: "H1hL15VdSxQ",
  Chill: "H1hL15VdSxQ",
  "Villain Arc": "imk4F4UGGvw",
  Slaying: "4u2O1k3u6kE",
  Grateful: "LjL6S7WNqJ0",
};

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
  Heartbroken: `[Verse]
Heart is heavy, tears won't dry
Wondering why you said goodbye

[Chorus]
I'll rise again, I'll be okay
Brighter days are on their way`,
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

export const booksByMood: Record<string, BookRec[]> = {
  Stressed: [
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", reason: "Because you care too much about things that don't matter", emoji: "😤" },
    { title: "Burnout: The Secret to Unlocking the Stress Cycle", author: "Emily & Amelia Nagoski", reason: "Science-backed way to actually chill out", emoji: "🧠" },
  ],
  "Down-Bad": [
    { title: "It's Not You", author: "Ramani Durvasula", reason: "For when you need to hear it really wasn't your fault", emoji: "💔" },
    { title: "Untamed", author: "Glennon Doyle", reason: "A wild, freeing read for your comeback era", emoji: "🦁" },
  ],
  Glowing: [
    { title: "You Are a Badass", author: "Jen Sincero", reason: "Fuel for your already-blazing fire", emoji: "🔥" },
    { title: "The Mountain Is You", author: "Brianna Wiest", reason: "Level up even higher, bestie", emoji: "🏔️" },
  ],
  Feral: [
    { title: "Why Does He Do That?", author: "Lundy Bancroft", reason: "Spoiler: because he chooses to", emoji: "📖" },
    { title: "The Gift of Fear", author: "Gavin de Becker", reason: "Trust that gut that's screaming at you", emoji: "⚡" },
  ],
  "In My Feels": [
    { title: "The Sun and Her Flowers", author: "Rupi Kaur", reason: "Poetry that gets what you're going through", emoji: "🌻" },
    { title: "All About Love", author: "bell hooks", reason: "A warm hug in book form", emoji: "🤗" },
  ],
  Chaotic: [
    { title: "Maybe You Should Talk to Someone", author: "Lori Gottlieb", reason: "Therapist-approved chaos management", emoji: "🛋️" },
    { title: "Year of Yes", author: "Shonda Rhimes", reason: "Say yes to the mess, it's content", emoji: "🎬" },
  ],
  Healing: [
    { title: "The Body Keeps the Score", author: "Bessel van der Kolk", reason: "Understand why your body still remembers", emoji: "🫀" },
    { title: "Atlas of the Heart", author: "Brené Brown", reason: "Map out your feelings and own them", emoji: "🗺️" },
  ],
};

export const recipesByMood: Record<string, RecipeRec[]> = {
  Stressed: [
    { name: "5-Minute Mug Brownie", ingredients: ["flour", "cocoa", "sugar", "milk", "microwave"], reason: "Instant comfort in a cup, no baking degree needed", emoji: "🍫" },
    { name: "Chamomile Latte", ingredients: ["chamomile tea", "honey", "warm milk", "cinnamon"], reason: "A warm hug in a mug for your frazzled nerves", emoji: "☕" },
  ],
  "Down-Bad": [
    { name: "Mac & Cheese (from scratch)", ingredients: ["pasta", "cheddar", "butter", "milk", "breadcrumbs"], reason: "The ultimate heartbreak comfort food", emoji: "🧀" },
    { name: "Salted Caramel Hot Chocolate", ingredients: ["cocoa", "sugar", "cream", "salt", "vanilla"], reason: "Sweet, salty, and exactly how you feel", emoji: "🍫" },
  ],
  Glowing: [
    { name: "Acai Bowl", ingredients: ["acai", "banana", "granola", "berries", "honey"], reason: "Eat the rainbow, match your vibe", emoji: "🥣" },
    { name: "Sparkling Lemonade", ingredients: ["lemons", "soda water", "mint", "honey", "ice"], reason: "As refreshing as your new era", emoji: "🍋" },
  ],
  Feral: [
    { name: "Spicy Ramen", ingredients: ["noodles", "gochujang", "egg", "garlic", "chili oil"], reason: "Spicy enough to match your energy", emoji: "🍜" },
    { name: "Angry Popcorn", ingredients: ["popcorn", "chili flakes", "lime", "butter", "salt"], reason: "Crunch away the frustration", emoji: "🍿" },
  ],
  "In My Feels": [
    { name: "Cinnamon Toast", ingredients: ["bread", "butter", "cinnamon", "sugar", "honey"], reason: "Simple, warm, nostalgic - like a hug from childhood", emoji: "🍞" },
    { name: "Berry Smoothie Bowl", ingredients: ["frozen berries", "yogurt", "banana", "granola", "coconut"], reason: "Blend your feelings into something beautiful", emoji: "🫐" },
  ],
  Chaotic: [
    { name: "Midnight Quesadilla", ingredients: ["tortilla", "cheese", "beans", "salsa", "avocado"], reason: "Because chaos tastes better with melted cheese", emoji: "🌮" },
    { name: "Kitchen Sink Cookies", ingredients: ["dough", "chocolate", "pretzels", "chips", "caramel"], reason: "Everything but the kitchen sink - very you right now", emoji: "🍪" },
  ],
  Healing: [
    { name: "Golden Milk Latte", ingredients: ["turmeric", "ginger", "coconut milk", "honey", "pepper"], reason: "Anti-inflammatory for your body and soul", emoji: "🟡" },
    { name: "Roasted Veggie Bowl", ingredients: ["sweet potato", "kale", "quinoa", "tahini", "chickpeas"], reason: "Nourish yourself back to strength", emoji: "🥗" },
  ],
};

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
      books: booksByMood["Down-Bad"],
      recipes: recipesByMood["Down-Bad"],
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
      books: booksByMood.Glowing,
      recipes: recipesByMood.Glowing,
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
      books: booksByMood.Stressed,
      recipes: recipesByMood.Stressed,
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
      books: booksByMood.Feral,
      recipes: recipesByMood.Feral,
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
      books: booksByMood.Glowing,
      recipes: recipesByMood.Glowing,
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
      books: booksByMood["In My Feels"],
      recipes: recipesByMood["In My Feels"],
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
      books: booksByMood.Healing,
      recipes: recipesByMood.Healing,
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
      books: booksByMood.Chaotic,
      recipes: recipesByMood.Chaotic,
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
