import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const channels: Record<string, { name: string; desc: string }> = {
  nasa: { name: "NASA", desc: "NASA missions — Apollo, Artemis, James Webb, Mars rovers, Voyager, Hubble, space shuttles, ISS construction, solar system exploration" },
  isro: { name: "ISRO", desc: "ISRO missions — Chandrayaan, Mangalyaan, Aditya-L1, Gaganyaan, PSLV, GSLV, SSLV, NavIC, ASTROSAT" },
  iss: { name: "ISS", desc: "International Space Station — construction, zero-gravity life, scientific experiments, spacewalks, crew rotations" },
  spacex: { name: "SpaceX", desc: "SpaceX — Falcon 9 reusability, Starship development, Raptor engine, Dragon crew, Starlink constellation" },
};

function buildFallback(ch: string) {
  const base = ch === "nasa" ? "NASA" : ch === "isro" ? "ISRO" : ch === "iss" ? "ISS" : "SpaceX";
  const topics = ch === "nasa"
    ? ["Apollo 11 Moon Landing", "Hubble Space Telescope", "James Webb Discoveries", "Mars Rovers", "Voyager Golden Record", "Space Shuttle Program", "ISS Construction", "Artemis Moon Base", "Cassini at Saturn", "Parker Solar Probe", "New Horizons Pluto", "Curiosity Mars", "Perseverance Rover", "Exoplanet Discoveries", "Earth from Space", "Solar Dynamics Observatory", "Chandra X-Ray", "Spitzer Space Telescope", "Juno at Jupiter", "Dawn at Ceres", "OSIRIS-REx Asteroid", "InSight Mars", "MAVEN Mars", "Lunar Reconnaissance", "TESS Exoplanets", "WISE Telescope", "SOFIA Observatory", "Apollo 13 Rescue", "Skylab Station", "Gemini Program", "Mercury Program", "Saturn V Rocket", "Space Launch System", "Hubble Deep Field", "Pillars of Creation", "Future of NASA"]
    : ch === "isro"
    ? ["Chandrayaan-1 Water Discovery", "Mangalyaan Mars Success", "Chandrayaan-3 South Pole", "PSLV Workhorse", "GSLV Development", "Aditya-L1 Sun Mission", "Gaganyaan Astronauts", "NavIC Navigation", "ASTROSAT Observatory", "SSLV Small Rocket", "Cartosat Earth Imaging", "INSAT Communication", "RISAT Radar Imaging", "GSAT Series", "IRNSS Network", "SPADEX Docking Test", "Reusable Launch Vehicle", "Cryogenic Engine", "Vikram Sarabhai Vision", "ISRO Space Station", "Venus Shukrayaan", "Mars Lander Plans", "NISAR Collaboration", "Chandrayaan-2 Journey", "PSLV-C37 104 Satellites", "GSLV MkIII", "LVM3 Heavy Rocket", "Human Rating HLVM3", "ISRO Startup Ecosystem", "SSLV-D2 Success", "EOS Series", "Oceansat Monitoring", "Megha-Tropiques", "SARAL Satellite", "ResourceSat Series", "Future of ISRO"]
    : ch === "iss"
    ? ["A Home in Space", "Building the Station", "Living in Zero-G", "Spacewalk Adventures", "Earth from Orbit", "Science Lab", "Growing Food", "Human Body Changes", "Crew Rotation", "Supply Missions", "Robotic Arm Canadarm2", "Russian Modules", "European Columbus", "Japanese Kibo", "Dragon Capsule", "Soyuz Journey", "Starliner Testing", "Exercise in Space", "Sleeping in Orbit", "Space Food", "Water Recycling", "Aurora Views", "Hurricane Watching", "City Lights at Night", "Sunrises Every 90 Min", "Record-Breaking Missions", "Scott Kelly Twin Study", "Christina Koch Record", "Space Station Assembly", "International Partnership", "Research Breakthroughs", "Technology Demonstrations", "Educational Outreach", "Future Commercial Stations", "Deorbit Plan 2031", "Legacy of the ISS"]
    : ["Falcon 9 Reusability", "Landing on Drone Ship", "Falcon Heavy Launch", "Starship Giant", "Raptor Engine", "Dragon Crew Vehicle", "Starlink Constellation", "Mars City Vision", "Lunar Starship", "Polaris Program", "Cargo Dragon", "Crew Dragon Touchscreens", "EVA Spacesuit Design", "Starbase Facility", "Chopstick Catch Tower", "Super Heavy Booster", "Starship V3 Upgrade", "Raptor 3 Engine", "Methane Fuel Mars", "In-Situ Resource Utilization", "SpaceX Founding Story", "Falcon 1 First Launch", "Grasshopper Tests", "Dragon to ISS", "FH Starman Launch", "Commercial Crew Program", "Starship SN15 Success", "Flight 5 Booster Catch", "Flight 7 Repeat Catch", "Starship V2 Flights", "Rapid Reusability Goal", "Point-to-Point Earth", "Starlink Internet Service", "Mars Base Alpha", "Starship in Space", "Future of SpaceX"];

  const parts = ["HOOK", "BACKSTORY", "TWIST", "CLIMAX", "OUTRO"];
  const hooks = [
    `Kya aapne ${base} ke is mission ka sonic boom suna? Jab yeh rocket 1.6 Mach ki speed se atmosphere ko cheer raha tha, toh uski vibration aapki seat tak aa rahi thi. 🔥 Yeh woh mission hai jo duniya ki space history badal dega!`,
    `Imagine karo — 400 km upar, temperature -270°C se +3000°C ke beech, ${base} ka yeh rocket carbon-composite body ko jhel raha hai. Yeh woh mission hai jo aapko wahaan le jaayega! 🌍`,
    `Yeh ${base} ka woh mission hai jismein thrust-to-weight ratio itna insane tha ki rocket ne 8G ka acceleration produce kiya. Sunne mein aapko lagega movie hai, lekin yeh 100% real hai! 🚀`,
  ];
  const backstories = [
    `${base} ke is mission ke peeche ${Math.floor(Math.random() * 10 + 5)} saal ki research hai. 3D-printed liquid engines, monolithic carbon composite structure, aur ek avionics system jo khud ko real-time adjust karta hai. Jab yeh rocket launch pad pe khada hai, toh uski body micro-vibrations produce kar rahi hoti hain — pressure sensors har second 1000 readings le rahe hote hain.`,
    `Yeh ${Math.floor(Math.random() * 50 + 30)} meter lamba rocket apne aap mein ek engineering marvel hai. Carbon fiber reinforced polymer se bana body, jo extreme temperatures ko jhel sakti hai. Aur iske engine ka specific impulse — ${Math.floor(Math.random() * 50 + 300)} seconds — jo duniya ke best engines mein se ek hai.`,
    `Isse pehle ki yeh mission launch ho, ${Math.floor(Math.random() * 10 + 5)} baar structural testing hui. Har baar kuch na kuch fail hua — kabhi fuel line mein cavitation, kabhi avionics mein glitch. Lekin ${base} engineers ne har baar root cause analysis kiya aur fix kiya.`,
  ];
  const twists = [
    `Lekin ${Math.floor(Math.random() * 3 + 2)} mahine pehle, ek aisi problem aayi ki poora mission almost cancel. Max-Q ke time — jo maximum dynamic pressure ka point hai — ek structure mein micro-crack detect hua. Sunke yakeen nahi hoga ki ek ${Math.random() > 0.5 ? "chhote seal ne" : "fuel regulator ne"} almost sab kuch rok diya. 😱`,
    `T-MINUS ${Math.floor(Math.random() * 10 + 30)} seconds pehle, alarm baj uttha. Gyroscope mein anomaly — stabilizer system malfunction. Agar yeh theek na hota, toh rocket apni trajectory se 4 degrees bhatak jaata. ${base} ka mission control kaise handle kiya?`,
    `Woh moment jab duniya ko laga sab khatam — ${Math.floor(Math.random() * 20 + 10)} seconds ke liye telemetry blackout hua. Lekin ${base} ne kuch aisa kiya jo kisne nahi socha. Manual override se system reboot karke wapas lock kar liya!`,
  ];
  const climaxes = [
    `T-MINUS 10... 9... 8... Main engine ignition — aap sun sakte hain woh guttural roar jo ${Math.floor(Math.random() * 100 + 500)} decibels ki intensity se aapke speakers ko hila deta hai! 7... 6... 5... LIFTOFF! ${base} ka sabse powerful mission space ki taraf ja raha hai! 🚀🔥`,
    `Jab ${Math.random() > 0.5 ? "stage separation" : "orbit insertion"} hua — woh moment! Sonic boom ki vibration aapke chest mein resonate karegi. ${Math.floor(Math.random() * 10 + 5)} seconds ka free fall, phir secondary ignition — aur payload apni orbit mein! ${base} ne phir se kamaal kar dikhaya!`,
    `Aur jab ${Math.random() > 0.5 ? "payload deploy" : "booster landing"} hua — woh exact second jab supersonic speed se booster ne flip maneuver kiya aur landing burn start kiya. Aap sun sakte hain woh engine ki crackle, jo atmosphere mein pressure waves create kar rahi thi. PURE CINEMA! 🌟`,
  ];
  const outros = [
    `Bhai, aapne ${base} ka yeh mission ka sonic boom apne ears mein feel kiya? Comment mein batayein ki sabse zabardast part kya laga! Aur SUBSCRIBE karna mat bhoolna — aise hi🔥 engineering breakdowns aate rahenge! 🚀`,
    `Mujhe batao — aap ${base} ke next mission mein kaunsa engineering parameter dekhna chahenge? Thrust-to-weight? Specific impulse? Ya aerodynamics? Comment mein batao aur bell icon daba do! 📡`,
    `Agar aapko yeh engineering breakdown pasand aaya toh LIKE karo aur apne doston ke saath SHARE karo. Aur haan — ${base} ka agla mission kab hai? Sahi answer comment mein chhod do! 🔥`,
  ];
  const visualCues: Record<string, string[]> = {
    HOOK: ["Rocket ignition slow-mo with smoke shockwaves", "Sonic boom visualization through Schlieren photography style", "Drone shot of rocket at night — vibration waves visible", "High-speed camera capture of exhaust nozzle at Max-Q", "Thermal camera view of engine test fire"],
    BACKSTORY: ["3D cross-section animation of carbon-composite layering", "CAD model rotating with labeled stress points", "Split screen: manufacturing + computer simulation", "Microscope footage of material grain structure", "Animation of fuel flow through 3D-printed channels"],
    TWIST: ["Red warning lights + telemetry screen with error code", "Dramatic zoom on oscilloscope showing anomaly waveform", "Black & white footage of engineers in urgent meeting", "Simulation showing what the crack could cause", "Countdown clock with digital glitch overlay"],
    CLIMAX: ["6-camera matrix showing liftoff from every angle", "Slow-motion shot of stage separation with ice falling", "Ground-level camera shaking from engine vibration", "Onboard camera looking down at Earth curving away", "Multi-screen control room celebration montage"],
    OUTRO: ["Earth from space zooming out to black", "Best moments montage with epic music swell", "Text overlay with channel logo + subscribe animation", "Behind-scenes clip of team hugging", "Drone pulling back from launch pad at sunset"],
  };
  const audioCues: Record<string, string[]> = {
    HOOK: ["Deep cinematic bass + distant rumble", "Heartbeat pulse synth + low frequency drone", "Rising tension pad + subtlemachine hum"],
    BACKSTORY: ["Narrative documentary piano + strings", "Soft ambient soundscape with periodic beeps", "Minimal tech-inspired electronic loop"],
    TWIST: ["Tension drums building + alarm beeps", "Dissonant strings + oscillating synth", "Rapid percussion + signal tone"],
    CLIMAX: ["Epic orchestral swell + real engine ignition", "Rock anthem drop + crowd cheering SFX", "Cinematic choir + heavy drums + sonic boom"],
    OUTRO: ["Triumphant strings resolving", "Acoustic guitar + wind ambient", "Uplifting beat fade with space ambience"],
  };

  const scenes: any[] = [];
  for (let i = 0; i < 36; i++) {
    const topic = topics[i % topics.length];
    const partIdx = i % 5;
    const part = parts[partIdx];
    const pool = part === "HOOK" ? hooks : part === "BACKSTORY" ? backstories : part === "TWIST" ? twists : part === "CLIMAX" ? climaxes : outros;
    const desc = pool[i % pool.length].replace(/{base}/g, base);
    const vc = visualCues[part];
    const ac = audioCues[part];
    scenes.push({
      title: `🚀 ${part}: ${topic}`,
      desc,
      visualType: ["rocket", "planet", "nebula", "aurora", "sun", "galaxy", "satellite", "moon", "starfield", "blackhole"][i % 10],
      duration: part === "HOOK" || part === "OUTRO" ? 20 + (i % 11) : 28 + (i % 8),
      color1: ["#1a0533","#0a1628","#1a0a2e","#0d1b2a","#1b0033","#0a0a2e","#1a0520","#0a1a30","#150a30","#0d1525"][i % 10],
      color2: ["#4a1942","#1b3a5c","#2d1b69","#1b3a4a","#4a1a5c","#1a2a4a","#3a1a50","#1a3050","#2a1a60","#1a2540"][i % 10],
      scriptPart: part,
      visualCue: vc[i % vc.length],
      audioCue: ac[i % ac.length],
      telemetry: {
        altitude: `${(100 + i * 25 + Math.floor(Math.random() * 20)).toLocaleString()} km`,
        speed: `${(25000 + i * 200 + Math.floor(Math.random() * 500)).toLocaleString()} km/h`,
        stage: i < 5 ? "LIFTOFF / STAGE 1" : i < 10 ? "STAGE 2 / FAIRING" : i < 15 ? "ORBIT INSERTION" : i < 20 ? "COAST PHASE" : i < 25 ? "PAYLOAD DEPLOY" : "MISSION COMPLETE",
        status: Math.random() > 0.3 ? "✅ NOMINAL" : "⚠️ CHECKING",
      },
    });
  }
  return scenes;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channel") || "nasa";
    const channel = channels[channelId];
    if (!channel) return NextResponse.json({ error: "Invalid channel" }, { status: 400 });

    if (groq) {
      try {
        const prompt = `You are a world-class aerospace engineering narrator and video scriptwriter. Generate EXACTLY 36 scenes for a documentary about ${channel.name}: ${channel.desc}.

CRITICAL: Every scene MUST include SENSORY engineering details — sonic booms, structural vibrations, Max-Q atmospheric resistance, thrust-to-weight transitions, carbon-composite stress, engine crackle, 3D-printed liquid engine fuel flow, specific impulse values, decibel levels, temperature extremes, pressure differentials. Make the viewer FEEL the physics.

Cycle through these parts repeatedly: HOOK (mystery), BACKSTORY (engineering tech), TWIST (critical failure), CLIMAX (launch/moment), OUTRO (CTA).

Each scene as JSON:
{
  "title": "emoji + PART NAME: specific topic",
  "desc": "2-3 sentences in Hinglish/punchy English with SENSORY engineering details — sonic booms, vibrations, Max-Q, thrust, temperature, pressure — make it FEEL real",
  "visualType": rocket|planet|nebula|aurora|sun|galaxy|satellite|moon|starfield|blackhole,
  "duration": 20-33,
  "color1": "hex",
  "color2": "hex",
  "scriptPart": "HOOK|BACKSTORY|TWIST|CLIMAX|OUTRO",
  "visualCue": "1 sentence describing cinematic B-roll — be specific",
  "audioCue": "1 sentence describing music and sound effects — include engine, sonic boom, rumble SFX",
  "telemetry": { "altitude":"km","speed":"km/h","stage":"STAGE","status":"NOMINAL" }
}

Return ONLY valid JSON: {"scenes":[...]}. No markdown, no code fences.`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an aerospace engineering narrator. Generate ONLY valid JSON." },
            { role: "user", content: prompt },
          ],
          max_tokens: 8192,
          temperature: 0.9,
        });

        const text = completion.choices[0]?.message?.content?.trim() || "";
        const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
        const parsed = JSON.parse(cleaned);
        if (parsed.scenes && Array.isArray(parsed.scenes) && parsed.scenes.length >= 30) {
          return NextResponse.json({ channel: channel.name, scenes: parsed.scenes.slice(0, 36) });
        }
      } catch { /* fallback */ }
    }

    return NextResponse.json({ channel: channel.name, scenes: buildFallback(channelId) });
  } catch (error) {
    console.error("Space video API error:", error);
    return NextResponse.json({ channel: "NASA", scenes: buildFallback("nasa") });
  }
}
