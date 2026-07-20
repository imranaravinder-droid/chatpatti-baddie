import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const cosmicRegions = [
  "Orion Nebula — stellar nursery of baby stars",
  "Andromeda Galaxy — our closest galactic neighbor on a collision course",
  "Saturn's Rings — ice and rock dancing at 64,000 km/h",
  "Jupiter's Great Red Spot — a storm larger than Earth raging for 400+ years",
  "Neutron Star Surface — a teaspoon weighs a billion tons",
  "Black Hole Event Horizon — where space and time swap places",
  "Exoplanet Proxima Centauri b — a world just 4.2 light-years away",
  "Crab Nebula Pulsar — a dead star spinning 30 times per second",
  "Io's Volcanic Surface — Jupiter's moon with 400 active volcanoes",
  "Europa's Underground Ocean — a hidden alien ocean beneath 15 km of ice",
  "Carina Nebula — birthplace of the most massive stars in the galaxy",
  "Venus Cloud Tops — sulfuric acid clouds with 370 km/h winds",
  "Mars' Valles Marineris — the Grand Canyon 10x longer and 5x deeper",
  "Titan's Methane Lakes — Saturn's moon with liquid hydrocarbon seas",
  "Betelgeuse — a red supergiant 764 times the Sun's diameter, about to explode",
  "Pillars of Creation — iconic star-forming towers in the Eagle Nebula",
  "Oort Cloud — a frozen shell of comets surrounding the solar system",
  "Milky Way Core — 400 billion stars packed around a supermassive black hole",
  "Laniakea Supercluster — the 520-million-light-year cosmic web we call home",
  "TRAPPIST-1 System — seven Earth-sized worlds orbiting an ultracool dwarf",
];

const fallback = [
  {
    region: "Orion Nebula",
    title: "🔥 Stellar Nursery",
    scene: "You float inside a cloud of glowing hydrogen larger than a thousand solar systems. Baby stars blink awake all around you, their radiation carving pillars of gas into cosmic sculptures. The nebula pulses with the slow breath of creation itself.",
    fact: "The Orion Nebula is the closest massive star-forming region to Earth, only 1,344 light-years away. It contains over 3,000 stars at various stages of birth.",
    reflection: "You are witnessing the birth of worlds. Just as stars emerge from chaos, your greatest creations begin as formless clouds of potential.",
  },
  {
    region: "Saturn's Rings",
    title: "💎 Ice Dancer",
    scene: "You glide alongside Saturn's rings — billions of ice and rock fragments, each one a tiny moonlet orbiting in perfect silence. The rings shimmer like a cosmic vinyl record, and Saturn itself looms massive, its golden bands stretching across the sky.",
    fact: "Saturn's rings are only about 10 meters thick despite spanning 282,000 km in diameter — thinner than a sheet of paper if scaled down.",
    reflection: "What looks solid from a distance is mostly empty space. Like the rings, you are made of countless small moments held together by something invisible.",
  },
  {
    region: "Black Hole Event Horizon",
    title: "🌀 Edge of Eternity",
    scene: "You stand at the edge of a supermassive black hole. Behind you, the universe glows in every wavelength. Ahead — nothing but an inky void surrounded by a ring of light bent into a perfect circle. Time slows down. Gravity sings at a frequency your soul can feel.",
    fact: "Inside a black hole's event horizon, space and time swap roles — 'going forward in time' becomes an inescapable fall toward the singularity.",
    reflection: "Some places in the universe remind you that not everything needs to be understood. The mystery itself is the experience.",
  },
  {
    region: "Europa's Underground Ocean",
    title: "🌊 Alien Depths",
    scene: "Beneath 15 kilometers of ice, you descend into a global ocean twice the size of Earth's. Hydrothermal vents glow on the seafloor, and shadows move in the darkness — life, thriving without sunlight. You are not alone in this universe.",
    fact: "Europa's subsurface ocean contains more water than all of Earth's oceans combined, and scientists believe it may harbor extraterrestrial life.",
    reflection: "Life finds a way even in the darkest, coldest places. Your struggles are your hydrothermal vents — they fuel your deepest growth.",
  },
];

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET() {
  try {
    const selected = shuffle(cosmicRegions).slice(0, 4);
    const prompt = `Generate 4 cosmic space exploration experiences. Each must be about a different cosmic location. Use these 4 regions (keep their names EXACTLY): ${JSON.stringify(selected)}. For each region, provide: title (with emoji), scene (2-3 vivid sensory sentences that make the user feel like they are THERE inside the cosmos), fact (one mind-blowing true scientific fact), reflection (a short cosmic life lesson). Make every scene feel "out of this world" — poetic, transcendent, spiritual. Return ONLY valid JSON array: [{"region": "...", "title": "...", "scene": "...", "fact": "...", "reflection": "..."}]`;

    if (groq) {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are COSMOS — the voice of the universe. Generate ONLY valid JSON. No markdown, no code fences, just raw JSON." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.9,
      });

      const text = completion.choices[0]?.message?.content?.trim() || "";
      const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length === 4) {
        return NextResponse.json({ explorations: parsed });
      }
    }

    return NextResponse.json({ explorations: fallback });
  } catch (error) {
    console.error("Space explore API error:", error);
    return NextResponse.json({ explorations: fallback });
  }
}
