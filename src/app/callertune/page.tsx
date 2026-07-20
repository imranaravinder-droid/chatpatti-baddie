"use client";
import { useState } from "react";

const script = `
Namaste! Aapka swagat hai CHATPATTIE BADDIE mein.

22 se zyada AI specialists — Study Master, Music Companion, Life Coach, Creative Studio. Sab free. Sab 24 Indian languages mein.

Call karein aur chatpatti ki duniya mein ghum jayein. Chatpattie Baddie — aapki apni AI family.

Try abhi: chatpatti-baddie.vercel.app
`;

const scripts = [
  { name: "Hindi 1", text: "Namaste! FREE AI jo aapki 24 bhashaon mein baat kare. Study, Space, Music, Life Coach — sab free. Chatpattie Baddie abhi try karein. chatpatti-baddie.vercel.app" },
  { name: "Hindi 2", text: "CHATPATTIE BADDIE — 22 AI agents, bilkul FREE. Homework help, music, life coach, sab kuch. Call karte rahein aur Chatpattie Baddie aapka intezaar kar raha hai. chatpatti-baddie.vercel.app" },
  { name: "Short & Catchy", text: "FREE AI — 24 Indian languages. CHATPATTIE BADDIE. 22 specialists. Abhi try karo. chatpatti-baddie.vercel.app" },
  { name: "English", text: "CHATPATTIE BADDIE. 22 AI specialists — 24 Indian languages. Study, Space, Music, Life Coach — all free. Try now at chatpatti-baddie.vercel.app" },
];

export default function CallerTunePage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [selected, setSelected] = useState(scripts[0]);

  const handlePlay = (text: string) => {
    if (playing) { speechSynthesis.cancel(); setPlaying(null); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1.1;
    utterance.onend = () => setPlaying(null);
    setPlaying(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📞</span>
          <div>
            <h1 className="text-xl font-bold">Chatpattie Baddie — Caller Tune Studio</h1>
            <p className="text-gray-400 text-xs">Set as your Jio/Airtel/VI caller tune. Everyone who calls you hears this.</p>
          </div>
        </div>

        {/* Script selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {scripts.map((s) => (
            <button key={s.name} onClick={() => setSelected(s)}
              className={`p-2 rounded-lg border text-[11px] font-bold text-left transition-all ${selected.name === s.name ? "bg-pink-600/20 border-pink-500/50 text-pink-300" : "bg-zinc-900 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800"}`}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Script display */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4 mb-4">
          <p className="text-sm text-white leading-relaxed">{selected.text}</p>
        </div>

        {/* Play + Record */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => handlePlay(selected.text)}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-opacity">
            {playing === selected.text ? "⏹ Stop" : "▶️ Preview — Listen"}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(selected.text); }}
            className="px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600/50 text-zinc-300 text-xs font-bold hover:bg-zinc-700">
            📋 Copy Text
          </button>
        </div>

        {/* Setup instructions */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-yellow-400">📱 Step-by-Step Setup</h2>

          <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4">
            <h3 className="text-xs font-bold text-green-400 mb-2">📡 Jio — Caller Tune Setup</h3>
            <div className="text-[11px] text-zinc-300 leading-relaxed space-y-1.5">
              <p><span className="text-zinc-500">1.</span> Open <span className="text-blue-400">MyJio app</span></p>
              <p><span className="text-zinc-500">2.</span> Tap <span className="text-yellow-400">"Caller Tunes"</span> → <span className="text-yellow-400">"Create Your Own"</span></p>
              <p><span className="text-zinc-500">3.</span> Record yourself reading the script above (or paste text)</p>
              <p><span className="text-zinc-500">4.</span> Save & Set as caller tune — <span className="text-green-400">FREE for first 30 days</span></p>
              <p className="text-zinc-600 mt-1">OR dial <span className="text-white">*333*<span className="text-yellow-400">TUNE_CODE</span>#</span> from Jio number</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4">
            <h3 className="text-xs font-bold text-red-400 mb-2">📡 Airtel — Caller Tune Setup</h3>
            <div className="text-[11px] text-zinc-300 leading-relaxed space-y-1.5">
              <p><span className="text-zinc-500">1.</span> Dial <span className="text-white">*678*<span className="text-yellow-400">0</span>#</span> → Call</p>
              <p><span className="text-zinc-500">2.</span> Select <span className="text-yellow-400">"Record Your Own Tune"</span></p>
              <p><span className="text-zinc-500">3.</span> Read the Chatpatti script when the beep sounds</p>
              <p><span className="text-zinc-500">4.</span> Confirm & Set — <span className="text-green-400">~₹30/month</span></p>
              <p className="text-zinc-600 mt-1">OR use Airtel Thanks app → Tune Factory → Record Your Tune</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4">
            <h3 className="text-xs font-bold text-purple-400 mb-2">📡 VI (Vodafone-Idea) — Caller Tune Setup</h3>
            <div className="text-[11px] text-zinc-300 leading-relaxed space-y-1.5">
              <p><span className="text-zinc-500">1.</span> Open <span className="text-blue-400">VI app</span> → <span className="text-yellow-400">"Caller Tunes"</span></p>
              <p><span className="text-zinc-500">2.</span> Tap <span className="text-yellow-400">"Create Your Tune"</span></p>
              <p><span className="text-zinc-500">3.</span> Record the Chatpatti script (15 seconds max)</p>
              <p><span className="text-zinc-500">4.</span> Set as active — <span className="text-green-400">~₹20/month</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
