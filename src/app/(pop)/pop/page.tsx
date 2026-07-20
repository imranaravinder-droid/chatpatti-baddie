"use client";
import { useEffect, useState } from "react";

const slotPrice = 2;

export default function PopPage() {
  const [source, setSource] = useState("");
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [adSlots, setAdSlots] = useState([false, false, false, false, false, false, false, false]);
  const [showNotify, setShowNotify] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const revenue = adSlots.filter(Boolean).length * slotPrice;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get("src") || "direct");
    const t = setInterval(() => setTimeOnPage(v => v + 1), 1000);
    setTimeout(() => setShowNotify(true), 5000);
    const handleLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setShowExit(true);
    };
    document.addEventListener("mouseleave", handleLeave);
    return () => { clearInterval(t); document.removeEventListener("mouseleave", handleLeave); };
  }, []);

  const refLink = typeof window !== "undefined"
    ? `https://chatpatti-baddie.vercel.app/chat?ref=${source}`
    : "/chat";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white" onClick={() => setClicks(v => v + 1)}>
      {/* Fake notification */}
      {showNotify && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-green-500/30 rounded-xl p-3 shadow-2xl shadow-green-500/10 max-w-[260px] animate-slideIn">
          <div className="flex items-start gap-2">
            <span className="text-lg">🎉</span>
            <div>
              <p className="text-[11px] text-green-400 font-bold">You won free access!</p>
              <p className="text-[9px] text-zinc-400">24-hour premium AI pass unlocked. Tap to claim.</p>
              <a href={refLink} className="text-[9px] text-blue-400 underline mt-1 inline-block">Claim now →</a>
            </div>
            <button onClick={() => setShowNotify(false)} className="text-zinc-500 text-xs ml-1">✕</button>
          </div>
        </div>
      )}

      {/* Exit intent popup */}
      {showExit && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowExit(false)}>
          <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-6 max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <span className="text-4xl block mb-2">⏳</span>
            <h3 className="text-white font-bold text-sm mb-1">Wait! Don&apos;t miss this!</h3>
            <p className="text-zinc-400 text-xs mb-4">Free AI tutor, music companion, and 22+ AI specialists — all in your language.</p>
            <a href={refLink}
              className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-bold text-center hover:scale-105 transition-transform">
              🔥 Try Chatpatti Free
            </a>
            <button onClick={() => setShowExit(false)} className="text-zinc-500 text-[10px] mt-2 hover:text-zinc-400">
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center bg-gradient-to-b from-gray-900 via-black to-gray-950">
        <div className="animate-pulse text-4xl mb-3">🤖🧠🚀</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">
          CHATPATTIE BADDIE
        </h1>
        <p className="text-gray-400 text-xs mb-5 max-w-md">
          22 AI Specialists · 24 Languages · Study Master · Music Companion · CB Lens
        </p>
        <a href={refLink}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-pink-500/30 mb-3">
          🗣️ Chat Now — Free
        </a>
        <div className="flex gap-2 flex-wrap justify-center">
          <a href="/try" className="px-4 py-1.5 rounded-full border border-white/15 text-white text-[10px] hover:bg-white/5 transition-colors">🚀 Try Free</a>
          <a href="/premium" className="px-4 py-1.5 rounded-full border border-yellow-500/20 text-yellow-400 text-[10px] hover:bg-yellow-500/10 transition-colors">🎙️ CB Talk</a>
          <a href="/pop-script" className="px-4 py-1.5 rounded-full border border-green-500/20 text-green-400 text-[10px] hover:bg-green-500/10 transition-colors">💰 Earn With Us</a>
        </div>
      </div>

      {/* Native ad placements */}
      <div className="bg-gray-950 border-t border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Sponsored Content</span>
            <span className="text-green-400 text-[10px] font-bold">${revenue.toFixed(2)} earned today</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[0,1,2,3].map(i => (
              <div key={i} className="bg-zinc-900 rounded-lg p-2 border border-zinc-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-[10px]">📢</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-zinc-300 truncate font-medium">Ad Placement {i+1}</p>
                  <p className="text-[7px] text-zinc-600">Replace with ad network code</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad slots + CTA */}
      <div className="bg-gray-950 border-t border-white/5 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {adSlots.map((sold, i) => (
              <button key={i} onClick={() => { if (!sold) { const n = [...adSlots]; n[i] = true; setAdSlots(n); } }}
                className={`py-1.5 rounded text-[9px] font-bold transition-all ${sold
                  ? "bg-green-600/20 text-green-400 border border-green-500/20"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-700/50 hover:bg-zinc-800 hover:text-white"}`}>
                {sold ? `✅ AD ${i+1}` : `💰 AD ${i+1}`}
              </button>
            ))}
          </div>
          <a href={refLink}
            className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold text-center hover:opacity-90 transition-opacity">
            🔥 TRY Chatpattie Baddie FREE →
          </a>
          <p className="text-[8px] text-zinc-600 text-center mt-1">
            {source !== "direct" ? `via ${source}` : "direct"} · {timeOnPage}s · {clicks.toLocaleString()} clicks
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
