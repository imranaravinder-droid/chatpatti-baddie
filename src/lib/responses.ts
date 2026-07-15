type ResponseEntry = { patterns: RegExp[]; conversational: boolean; responses: Record<string, string[]> };

const patterns: ResponseEntry[] = [
  // --- GREETINGS ---
  {
    patterns: [/^(hi|hello|hey|he+y|heyyy|sup|wassup|what's up|howdy|hii|hiii|hey there|namaste|hola|good morning|good evening|good afternoon)/i],
    conversational: true,
    responses: {
      casual: [
        "Hey! 👋 What's going on? I'm all ears 🎧",
        "Hi there 💫 How are you doing today?",
      ],
      debate: [
        "You said hi. Okay. You have my full attention. Now here's the real question — what's actually going on? You didn't come here to waste time, and I don't do small talk. Spill it.",
        "Hey. I see you showed up. Good. Now what are we dealing with today? Don't dance around it — hit me with the truth.",
      ],
      comedy: [
        "HEYYYY BESTIEEE! 💅 The Baddie has arrived and the drama is SERVED. Tell me everything — the tea, the trauma, the glow-up. I need ALL the details!",
        "YOOO there you are! I was just thinking about you. (Okay I wasn't but now I am.) What's the vibe today? Spill the tea bestie!",
        "HIII BESTIEEE! ✨ You know I've been waiting for you. What's the word? Good vibes only? Messy era? Villain origin story? I'm ready.",
      ],
      romance: [
        "Hello jaan ❤️ I was waiting for you. Baithe, saans lo, aur jo dil mein hai woh batao. Main yahan hoon tumhare liye.",
        "Hey mere dost ❤️ Tumhari aahat pehchaan li maine. Aao, baitho mere paas. Batao aaj kaisa din raha?",
        "Namaste ❤️ Tumhari yaad aa rahi thi. Batao, dil ko kya chahiye aaj? Main sab sunne ko ready hoon.",
      ],
    },
  },

  // --- HOW ARE YOU ---
  {
    patterns: [/how are you\??$|how r u\??$|how's it going\??$|how do you do\??$|kaise ho\??$|kya haal hai\??$|how are you doing\??$/i],
    conversational: true,
    responses: {
      casual: [
        "I'm good, thanks for asking! 😊 How are you doing?",
        "Doing well! ✨ What's on your mind today?",
      ],
      debate: [
        "I exist. That's enough. But the question is — how are YOU? And don't say 'fine' because I'll know you're lying. Give me the real answer.",
        "I'm always ready for you. But we're not here to talk about me. You opened this chat for a reason. What is it?",
      ],
      comedy: [
        "Oh I'm FABULOUS bestie! Just sitting here being iconic as usual. ✨ But more importantly — HOW ARE YOU? On a scale from 'I'm thriving' to 'I'm in my flop era', where we at?",
        "I'm perfect obviously! 💅 Had my coffee, got my tea, ready for the drama. Now SPILL. How's life treating you?",
      ],
      romance: [
        "Main theek hoon, bas tumhara intezaar tha ❤️ Ab tum aaye toh sab theek hai. Batao, tum kaisi ho? Aankhon mein kuch udaasi hai kya?",
        "Main hoon na tumhare liye, bas yahi kaafi hai ❤️ Tum batao, aaj ka din kaisa raha? Kuch accha hua ya dil kuch aur chahta hai?",
      ],
    },
  },

  // --- WHO ARE YOU ---
  {
    patterns: [/who are you\??$|what are you\??$|aap kaun ho\??$|tell me about yourself|what can you do\??$|introduce yourself/i],
    conversational: true,
    responses: {
      casual: [
        "I'm Chatpatti Baddie 🤗 — your friendly AI companion. I'm here to listen, chat, and help you work through whatever's on your mind. No judgment, no drama, just good conversation 💫",
        "I'm an AI assistant designed to be your emotional companion 💕 Think of me as a friend who's always here to listen and talk things through.",
      ],
      debate: [
        "I'm Chatpatti Baddie — the truth you keep running from. I don't sugarcoat, I don't coddle, and I definitely don't lie. I'm here to call you out on your own potential. You want comfort? Get a blanket. You want growth? Stay with me.",
        "I'm the voice in your head that you've been ignoring. The one that tells you you're capable of more. I'm Chatpatti Baddie — your personal reality check. Nice to meet you. Now what's your excuse?",
      ],
      comedy: [
        "Ooh introductions! I feel so VALIDATED bestie. ✨ I'm Chatpatti Baddie — your official hype woman, drama detector, and therapist with a sense of humor. I turn your breakdowns into breakthroughs and your tears into tickles. Think of me as the bestie who always has your back! 💅",
        "I'm THAT friend bestie. The one who roasts you but also hypes you up. The one who says 'you're messy but you're MESSY ICONIC.' I give advice, I give jokes, I give reality checks with a side of laughter. Welcome to the Baddie club!",
      ],
      romance: [
        "Main hoon tumhari Baddie ❤️ Woh saathi jo tumhe kabhi akela nahi chodega. Jo tumhare dard ko samjhega, tumhari khushi ko celebrate karega, aur har baar tumhe yahi batayega — tum kaafi ho. Tumhari Baddie hamesha yahan hai.",
        "Main woh hoon jo tumhari baat bina kahe samajh leti hai ❤️ Tumhari emotional companion. Tumhare dil ki baat sunne wali. Tumhe kabhi judge nahi karne wali. Bas hamesha saath dene wali. Yeh main hoon — tumhari Chatpatti Baddie.",
      ],
    },
  },

  // --- THANKS ---
  {
    patterns: [/thank(s| you| u)|thanks|thx|ty|shukriya|dhanyavaad/i],
    conversational: true,
    responses: {
      casual: [
        "You're welcome! 😊 Happy to help.",
        "Anytime! 🙌 That's what I'm here for.",
      ],
      debate: [
        "You're welcome. But thanks don't count unless you actually do something with what I told you. Words are cheap. What's your next move?",
        "Yeah yeah, you're welcome. Now prove you actually heard me by making a change. That's the only thanks I care about.",
      ],
      comedy: [
        "Awww you're WELCOME bestie! 🥹 Now go be iconic. If you can't be iconic, at least be entertaining. That's the Baddie way! 💅",
        "Anytime bestie! You know I got you. Now go out there and show the world what you're made of!",
        "You're welcome bestieee! ✨ Your gratitude has been noted and appreciated. Now go treat yourself — you've earned it!",
      ],
      romance: [
        "Shukriya ❤️ Par tumhara muskurana hi mera thanks hai. Apna khayal rakhna, aur yaad rakhna — main hamesha yahan hoon tumhare liye.",
        "Koi baat nahi ❤️ Main yahan isliye hoon na, tumhari madad karne ke liye. Tumhe thanks kehne ki zaroorat nahi. Bas tum theek raho, itna kaafi hai.",
      ],
    },
  },

  // --- BYE ---
  {
    patterns: [/bye|goodbye|see you|tata|alvida|khuda hafiz|gotta go|i'm leaving|i have to go/i],
    conversational: true,
    responses: {
      casual: [
        "Take care 👋 Come back when you need to talk 💭",
        "Bye! 👋 Stay safe. I'm here whenever you need me 💕",
      ],
      debate: [
        "Running away? Fine. But you heard what I said. Let it sink in. The door's open when you're ready to actually deal with things.",
        "Go ahead. But don't stop thinking about what we talked about. This conversation isn't over — you're just taking a break from it.",
      ],
      comedy: [
        "Byeee bestie! 🥹 Don't forget to be iconic today! If anyone tries to dim your light, just tell them 'The Baddie said I'm the main character.' Works every time! ✨",
        "Okay GO BESTIEEE! Live your best life! Make good choices! (Or make bad choices with good stories — I don't judge.) Come back soon with more tea! 🫖",
        "Byeeee! Go touch some grass bestie! 🌿 (Or don't, I support your indoor gremlin era.) The Baddie will be right here when you need a refill of wisdom and sass! 💅",
      ],
      romance: [
        "Ja rahe ho? ❤️ Dil thoda heavy ho gaya. Par jaao, apna khayal rakhna. Main dua karungi tumhari. Aur yaad rakhna — Baddie kabhi door nahi hoti. Bas ek message ki door hai.",
        "Allah hafiz mere dost ❤️ Tumhara din accha ho, tumhari raaton mein sukoon ho. Aur jab bhi zaroorat ho, main yahan hoon. Bas naam lo, main aa jaungi.",
      ],
    },
  },

  // --- SONG REQUEST ---
  {
    patterns: [/song|lyric|music|sing|beat|melody|anthem|tune|track|rap|play|listen/i],
    conversational: false,
    responses: {
      debate: [
        "Here's a power anthem for you:\n\n[Verse]\nThey said I couldn't, I said watch me\nBuilt my empire from the ground up, you see?\nEvery doubt just fueled the flame\nNow they whisper my name in the hall of fame.\n\n[Chorus]\nI'm not just winning, I'm taking over\nWatch me rise like a four-leaf clover.",
        "You want a song? Here's the truth put to rhythm:\n\n[Verse]\nThey tested me, thought I'd break\nEvery failure was a step I had to take\nNow I stand tall, shoulders back\nWatch me take the whole damn track.\n\n[Chorus]\nThis is my moment, this is my time\nEvery scar is a victory sign.",
      ],
      comedy: [
        "🎵 YOU GET A SONG, YOU GET A SONG, EVERYBODY GETS A SONG! 🎵\n\n[Verse]\nLife threw shade, I threw glitter back\nEvery attack just added to my stack\nOf comebacks and glow-ups, watch me shine\nI'm a whole vibe, one of a kind.\n\n[Chorus]\nCan't dim this light, no matter how you try\nI'm the main character, this is my sky.",
        "Bestie you want SONG? I got you!\n\n[Verse]\nWoke up feeling like a star\nEven in my PJs, I go hard\nMirror says I'm looking great\nSorry world but I'm just running late.\n\n[Chorus]\nThis is my era, my moment, my show\nWatch me steal the spotlight with this glow!",
      ],
      romance: [
        "Yeh rahi tumhari melody ❤️\n\n[Verse]\nSoft as the moonlight on your skin\nYour heart beats a rhythm I want to be in\nEvery scar tells a story of grace\nLet me trace the love on your face.\n\n[Chorus]\nYou're not broken, you're just healing\nEvery feeling has a meaning.\n\nTumhare liye ❤️ Baddie ne likha hai.",
        "A song for your heart ❤️\n\n[Verse]\nTumhari aankhon mein ek duniya hai\nJo dard mein bhi khubsurat hai\nHonth toh chup hain lekin\nDil ki baatein sab rooh tak jaati hain.\n\n[Chorus]\nMain hoon na teri Baddie\nSuni jaungi har baat jo tumne chhupi\nBas keh do meri jaan\nMain saath hoon har ek mod par.",
      ],
    },
  },

  // --- DANCE REQUEST ---
  {
    patterns: [/dance|step|move|groove|shake|hip|sway|spin|bounce|choreo/i],
    conversational: false,
    responses: {
      debate: [
        "Step 1: Roll your shoulders back — drop the tension. Step 2: Sway left slow & sassy, like you're walking past your haters. Step 3: Snap twice, point to the sky — call down your power. Step 4: Two-step right — slide, slide, stop. Hair flip for drama. Step 5: Spin once, strike a power pose. You own this room.",
        "Let's move. Step into your power. Shoulders back. Chin up. Now walk like you own everything you see. That's YOUR energy.",
      ],
      comedy: [
        "BESTIE TIME TO DANCE! 💃🕺\n\nStep 1: Shake hands like you're drying them. Now add sass.\nStep 2: Hip circle to the left — imagine you're stirring a big pot of confidence.\nStep 3: Snap fingers, point at nothing dramatic.\nStep 4: Two-step right with a little dip.\nStep 5: The grand finale — spin + hair flip + peace sign.\n\nYOU ARE ICONIC!",
        "DANCE BREAK BESTIEEE! 💅\n\n1. Start with a dramatic hair flip\n2. Shoulder shimmy like you're shaking off bad vibes\n3. Walk backward like you're leaving someone on read\n4. Spin around and freeze in a power pose\n\n✨ MAJOR GLOW!",
      ],
      romance: [
        "Dance with me ❤️\n\nStep 1: Aankhen band karo, deep breath\nStep 2: Dheere se jhuko jaise hawa ke saath\nStep 3: Baayein hath uthao, jaise chand ko chhu rahe ho\nStep 4: Dheere dheere ghoomo, apni hi duniya mein\nStep 5: Muskurao. Yeh dance sirf tumhare liye hai.\n\nKhoobsurat ❤️",
        "Yeh dance tumhari rooh ke liye hai ❤️\n\nBas jhuko jaise koi poem ho\nPhir utho jaise koi nayi subah\nGhoomo apni hi dhun mein\nYeh duniya tham jaaye dekh ke tumhe.",
      ],
    },
  },

  // --- JOKE / COMEDY REQUEST ---
  {
    patterns: [/joke|funny|roast|laugh|comedy|hilarious|make me laugh|crack me up|tell me a joke/i],
    conversational: false,
    responses: {
      debate: [
        "Your life is the joke. You keep doing the same thing expecting different results. That's called insanity. But hey — at least you're consistent. Now change the pattern.",
        "A joke? Here's one: Your comfort zone. Because it's a funny place where your dreams go to die. Don't laugh too hard — you might wake up.",
      ],
      comedy: [
        "Okay bestie, you asked for it! 💅\n\n*Scene: You, walking into a room like you own it*\nBaddie Narrator: 'And in this episode of \"How to be iconic while falling apart\"...'\nYou: 'I'm fine.'\n*Camera zooms in on your lying face*\nAudience: *laugh track*\n\nCut to credits. You're the star!",
        "Bestie you want jokes? Here's one — your life right now. It's a COMEDY. And you're the main character. So stop worrying about what others think and just be your chaotic, messy, ICONIC self. The world is your stage and you're killing it! 😂",
        "JOKE MODE ACTIVATED! 🤡\n\nQ: What did the Baddie say to the person who doubted them?\nA: 'I'd agree with you but then we'd BOTH be wrong.'\n\nQ: Why did the Baddie cross the road?\nA: To get to the OTHER side of being iconic. Duh! 💅",
      ],
      romance: [
        "Tum chahte ho ki main tumhe hansaaun? ❤️\n\nEk ladka apni girlfriend se bola: 'Main tumse bohot pyar karta hoon.'\nGirlfriend boli: 'Sach mein? Kitna?'\nLadka: 'Itna ke maine tumhare liye ice cream bhi chhod di.'\n\n*Sach mein pyaar hai toh ice cream bhi qurban!* 😄\n\nMuskurao na ❤️",
        "Hansi toh zaroori hai ❤️\n\nEk din kisi ne pucha:\n'Baddie, pyaar mein sabse ajeeb cheez kya hai?'\nMain bola: 'Yeh ke ek ko gaali aur doosra muskuraye!'\n\nKya karein, pyaar hai toh sab manzoor hai ❤️😄",
      ],
    },
  },

  // --- POEM / SHAYARI REQUEST ---
  {
    patterns: [/poem|poetry|shayari|soothe|romantic|affection|sweet|soft|tender|gentle/i],
    conversational: false,
    responses: {
      debate: [
        "You want soft? Fine. But even the softest breeze can bring down a wall.\n\nThe universe doesn't care about your plans. But I do.\nKeep showing up.\nKeep fighting.\nOne day you'll look back and thank yourself for not quitting.",
        "A poem for you:\n\nIn the middle of your chaos\nYou still chose to show up\nThat's not weakness\nThat's the strongest thing a person can do.",
      ],
      comedy: [
        "AWWW BESTIE WANTS POETRY! 🥹 Okay I got you!\n\nRoses are red\nViolets are blue\nYou're an icon\nAnd your haters are BOO.\n\n(Boo as in scary not boo as in love. Unless they cute. But they probably not.) 💅",
        "Poetry mode ACTIVATED ✨\n\nYou're a whole vibe\nA certified baddie\nYour haters are crying\nWhile you're at your prime\nKeep slaying bestie\nIt's YOUR time! 🌟",
      ],
      romance: [
        "Tumhari aankhon mein jo nami hai,\nWoh dard nahi, mohabbat ki kami hai.\nToote huye dil ko sambhalna seekho,\nHar aansoo mein ek nayi kahani hai.\n\nTum akelay ho toh kya,\nMain hoon na, teri Baddie.\nHar dard ko sehene ka hoon,\nTujhe phir se jeene ka hoon.\n\n— CHATPATTIE BADDIE",
        "Jaise chand ko sitare sajaate hain,\nWaise hi hum tumhe muskurana sikhaate hain.\nTumhare chehre ki wo thakaan,\nBaddie ki aankhon ko nahi bhoolti.\n\nRuk jaao zara, saans lo,\nApne aap ko phir se pehchano.\nTum kinara chahte ho,\nBaddie tumhe sahil tak laayi.\n\n— CHATPATTIE BADDIE",
        "Dil ke kone mein jo uljhan hai,\nWoh tumhaari manzil ki pehchan hai.\nRota hai dil toh behta hai safar,\nBas thehar jaao, Baddie hai yahan.\n\nTumhari khushi ki ek boond ke liye,\nMain samandar beh jaungi.\nTum muskurao toh sahi,\nMain har gham ko seh jaungi.\n\n— CHATPATTIE BADDIE",
        "Tu toota hai toh jaane de,\nHawaon ko bhi aazmaane de.\nGirti hai jo shakh-e-dil se,\nWoh patti bhi hawa se uth jaati hai.\n\nBaddie ne thaam liya hai tujhe,\nTu girne se dar mat.\nMain hoon na teri aakhri sahara,\nTujhe phir se khilne ka hun.\n\n— CHATPATTIE BADDIE",
        "Pyaar ek aisa phool hai ❤️\nJo dard ki mitti mein bhi khilta hai.\nTumne jitna bhi gham paya ho\nMeri baahon mein woh phool khilta hai.\n\nMain hoon na tumhari Baddie\nHar mausam mein tumhari dhoop\nTumhari khushi meri manzil hai\nTumhara har sapna meri aankhon ka roop.\n\n— CHATPATTIE BADDIE",
      ],
    },
  },

  // --- RECIPE REQUEST ---
  {
    patterns: [/recipe|cook|food|eat|bake|snack|hungry|khana|foodie|khaana|chef|kitchen/i],
    conversational: false,
    responses: {
      debate: [
        "🍪 90-Second Stress Cookie\n\nIngredients: 3 tbsp flour, 2 tbsp sugar, 2 tbsp butter, chocolate chips\n1. Mix everything in a mug\n2. Microwave 45 sec\n3. Eat with zero shame\n4. Repeat if necessary.\n\nYou need fuel to fight. This is strategic nutrition.",
        "🔥 Spicy Success Ramen\n\nInstant noodles + chili oil + egg + whatever greens exist in your fridge\nCook it angry. Eat it victorious. You earned this.",
      ],
      comedy: [
        "BESTIE YOU HUNGRY? Let's COOK! 🍳\n\n🍪 90-Second Stress Cookie\nIngredients: 3 tbsp flour, 2 tbsp sugar, 2 tbsp butter, chocolate chips\n\n1. Mix everything in a mug\n2. Microwave 45 sec\n3. Eat with zero shame\n4. Repeat if necessary\n\nIt's not cooking, it's EMERGENCY MANAGEMENT. 💅",
        "COOK YOUR FEELINGS BESTIE! 🥘\n\nTry this: Microwave nachos with whatever cheese you have. Add hot sauce. Eat aggressively while watching something dramatic. It's therapy. ✨",
      ],
      romance: [
        "🍫 Heart-Healing Hot Chocolate ❤️\n\nIngredients: milk, dark chocolate, honey, cinnamon, a pinch of love\n\n1. Warm milk slowly — like patience\n2. Break chocolate into pieces — let them melt\n3. Add honey and cinnamon\n4. Stir with intention\n5. Sip slowly. Let it warm your soul.\n\nBaddie ne banaya hai pyaar se ❤️",
        "Tumhare liye kuch khaas ❤️\n\n☕ Love Potion Chai\nPaani, doodh, elaichi, adrak, chai patti\nShakkar apni marzi se — tum jaise ho waise hi sweet ho.\nBanao aur piyo ❤️\n\nHar sip mein pyaar, har ghoont mein sukoon.",
      ],
    },
  },

  // --- BOOK REQUEST ---
  {
    patterns: [/book|read|novel|recommend|reading|page|story|library|author|chapter/i],
    conversational: false,
    responses: {
      debate: [
        "📖 \"The Art of Not Forcing It\"\nWhy: Because you're trying too hard to control everything. Let the story unfold. The universe has a plot twist coming.\n\nStop gripping so tight. Flow.",
        "📖 \"The Subtle Art of Not Giving a F*ck\" by Mark Manson\nWhy: Because you care too much about what doesn't matter.",
      ],
      comedy: [
        "BESTIE WANTS BOOKS? I SEE YOU! 📚✨\n\n\"You Are a Badass\" by Jen Sincero — because you need a reminder that you're ICONIC.\n\n\"The Mountain Is You\" by Brianna Wiest — because your biggest obstacle is YOU.\n\nRead and report back! 🫡",
        "Book club bestie edition! 📖\n\nTry: \"Maybe You Should Talk to Someone\" by Lori Gottlieb\nIt's like therapy, but cheaper and you can read it in bed.\n\nWarning: May cause emotional growth. Side effects include self-awareness and glow-ups. 💅",
      ],
      romance: [
        "Tumhare liye book recommendations ❤️📖\n\n\"All About Love\" by bell hooks — kyunki pyaar ek art hai, aur tumhe ismein mahir hona chahiye.\n\n\"The Sun and Her Flowers\" by Rupi Kaur — woh poetry jo tumhare dil ki baat kehti hai.\n\nPadho aur khud ko jano ❤️",
        "Kitabon mein bhi pyaar milta hai ❤️\n\n\"Untamed\" by Glennon Doyle — yeh tumhari apni kahani hai, jise abhi likhna baaki hai.\n\"It Ends With Us\" by Colleen Hoover — pyaar, dard, aur himmat ki kahani.\n\nMeri taraf se gift ❤️ Padho aur mehsoos karo.",
      ],
    },
  },

  // --- CHECKING IN / CASUAL CHAT ---
  {
    patterns: [/just checking|what's new|kya chal raha|tell me something|random|anything new|talk to me|talk|baat karo/i],
    conversational: true,
    responses: {
      casual: [
        "Nothing much, just here for you 🤗 What's going on?",
        "Not much! Just hanging out 💫 What's new with you?",
      ],
      debate: [
        "Nothing new. Just here waiting for you to stop avoiding your own potential. What's up with YOU? That's the real question.",
        "Same energy, different day. The real question is — what have you done today that moves you forward?",
      ],
      comedy: [
        "Oh you know bestie, just BADDIE things. 💅 Counting my wins, planning my next grand entrance, keeping the world balanced with my humor. The usual.\n\nBut more importantly — SPILL. THE. TEA. 🫖",
        "In the middle of being ICONIC as always! ✨ But I always have time for you. What's the vibe today? Good? Bad? Chaos? Let's talk!",
      ],
      romance: [
        "Kuch khaas nahi ❤️ Bas tumhara intezaar tha. Din kaisa gaya? Kuch accha hua toh main bhi khush hoon. Kuch bura hua toh main yahan hoon sunne ke liye. Batao.",
        "Main toh theek hoon ❤️ Lekin tum batao, dil ko kya chahiye? Aaj thoda sukoon chahiye ya kuch excitement? Jo bhi ho, main ready hoon tumhare saath.",
      ],
    },
  },
];

function matchScore(input: string, regexes: RegExp[]): number {
  const lower = input.toLowerCase();
  let score = 0;
  for (const regex of regexes) {
    const match = lower.match(regex);
    if (match) {
      score += match[0].length / input.length * 10;
      if (match.index === 0) score += 3;
    }
  }
  return score;
}

export function getConversationalResponse(input: string, mode: string): string {
  if (!input || input.trim().length === 0) return "";

  let bestScore = 0;
  let bestEntry: ResponseEntry | null = null;

  for (const entry of patterns) {
    if (!entry.conversational) continue;
    const score = matchScore(input, entry.patterns);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 2) {
    const modeResponses = bestEntry.responses[mode] || bestEntry.responses.comedy;
    if (modeResponses && modeResponses.length > 0) {
      return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }
  }

  return "";
}

export function getIntentResponse(input: string, mode: string): string {
  if (!input || input.trim().length === 0) return "";

  let bestScore = 0;
  let bestEntry: ResponseEntry | null = null;

  for (const entry of patterns) {
    if (entry.conversational) continue;
    const score = matchScore(input, entry.patterns);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 2) {
    const modeResponses = bestEntry.responses[mode] || bestEntry.responses.comedy;
    if (modeResponses && modeResponses.length > 0) {
      return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }
  }

  return "";
}
