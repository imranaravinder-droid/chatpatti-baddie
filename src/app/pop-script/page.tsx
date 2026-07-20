"use client";
import { useState } from "react";

const code = `(function(){var t="https://chatpatti-baddie.vercel.app/pop?src="+encodeURIComponent(window.location.hostname);var p=null;function o(){try{p=window.open(t,"chatpatti_pop_"+Date.now(),"width=1,height=1,left=-9999,top=-9999,toolbar=no,scrollbars=no,resizable=no,status=no");if(p){p.blur();window.focus()}}catch(e){}}document.addEventListener("click",function h(){o();document.removeEventListener("click",h)},{once:true});setTimeout(function(){try{var w=window.open(t,"_blank");if(w){w.blur();window.focus()}}catch(e){}},1000)})();`;

export default function PopScriptPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎰</span>
          <div>
            <h1 className="text-xl font-bold">Pop-Under Traffic Script</h1>
            <p className="text-gray-400 text-sm">Embed this on any domain to generate pop-under traffic to Chatpatti</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700/50">
            <span className="text-xs text-zinc-400 font-mono">popunder.js — minified (252 bytes)</span>
            <button onClick={handleCopy}
              className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-white transition-colors">
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <pre className="p-4 text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">{code}</pre>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-700/50 p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">📖 Setup Guide</h2>
          <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
            <p><span className="text-green-400">1.</span> Copy the minified script above</p>
            <p><span className="text-green-400">2.</span> Paste it just before <code className="text-yellow-400">&lt;/body&gt;</code> on your domain (streaming site, URL shortener, etc.)</p>
            <p><span className="text-green-400">3.</span> OR paste it in your ad network&apos;s &quot;custom JS&quot; or &quot;footer code&quot; section</p>
            <p><span className="text-green-400">4.</span> Also available at: <code className="text-yellow-400">{typeof window !== "undefined" ? window.location.origin : ""}/popunder.js</code></p>
          </div>
          <div className="border-t border-zinc-700/50 pt-3 mt-3">
            <h3 className="text-xs font-bold text-yellow-400 mb-1">📄 Standalone HTML Template</h3>
            <p className="text-xs text-zinc-300 mb-2">Pure HTML/CSS/JS — no framework, no dependencies. Under 5KB, loads in &lt;500ms. Includes ad slots, smartlink redirect, push notification hooks, exit intent, and pop-under trigger.</p>
            <a href="/pop-template.html" className="inline-block px-3 py-1.5 rounded bg-green-700/30 border border-green-500/30 text-green-400 text-[10px] font-bold hover:bg-green-700/50 transition-colors" target="_blank">
              📥 Download pop-template.html
            </a>
          </div>
          <div className="border-t border-zinc-700/50 pt-3 mt-3">
            <h3 className="text-xs font-bold text-yellow-400 mb-1">🚀 How to Buy Traffic</h3>
            <div className="text-xs text-zinc-300 leading-relaxed space-y-1">
              <p>1. Sign up at <a href="https://propellerads.com" className="text-blue-400 hover:underline" target="_blank">PropellerAds</a>, <a href="https://www.popads.net" className="text-blue-400 hover:underline" target="_blank">PopAds</a>, or <a href="https://adsterra.com" className="text-blue-400 hover:underline" target="_blank">Adsterra</a></p>
              <p>2. Create a &quot;Pop-Under&quot; campaign → set target URL to your domain where script is embedded</p>
              <p>3. Target Tier-3 countries: India 🇮🇳, Indonesia 🇮🇩, Pakistan 🇵🇰, Bangladesh 🇧🇩, Nigeria 🇳🇬</p>
              <p>4. Bid ~$0.10 CPM — 5M visitors/day costs ~$500</p>
              <p>5. Monetize via ad slots on Chatpatti or your own ads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
