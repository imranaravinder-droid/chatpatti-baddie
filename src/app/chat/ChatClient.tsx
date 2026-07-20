"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VentInput from "@/components/VentInput";
import LanguageSelector from "@/components/LanguageSelector";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import BaddieResponse from "@/components/BaddieResponse";
import { Language } from "@/lib/lang";
import { Mode, BaddieResponse as BaddieResponseType } from "@/types";

const UI_STRINGS: Record<string, Record<string, string>> = {
  "CHATPATTIE BADDIE": {
    hi: "चैटपट्टी बैडी", mr: "चॅटपट्टी बॅडी", bn: "চ্যাটপট্টি ব্যাডি",
    gu: "ચેટપટ્ટી બેડી", pa: "ਚੈਟਪੱਟੀ ਬੈਡੀ", ta: "சாட்பாட்டி பேடி",
    te: "చాట్పట్టి బ్యాడీ", kn: "ಚಾಟ್ಪಟ್ಟಿ ಬ್ಯಾಡಿ", ml: "ചാറ്റ്പട്ടി ബാഡി", ur: "چیٹ پٹی بیڈی",
  },
  "Send": {
    hi: "भेजें", mr: "पाठवा", bn: "পাঠান", gu: "મોકલો", pa: "ਭੇਜੋ",
    ta: "அனுப்பு", te: "పంపు", kn: "ಕಳುಹಿಸು", ml: "അയയ്ക്കുക", ur: "بھیجیں",
  },
};

export default function ChatPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("casual");
  const [ventResponse, setVentResponse] = useState<BaddieResponseType | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [refCode, setRefCode] = useState("");
  const [refCount, setRefCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [lastReply, setLastReply] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("owner")) {
      localStorage.setItem("baddie_user_email", "owner@chatpatti.com");
      localStorage.setItem("baddie_user_name", "Owner");
    }
    const email = localStorage.getItem("baddie_user_email");
    if (!email) {
      router.replace("/");
    }
    const code = localStorage.getItem("baddie_ref_code") || btoa(email || "").replace(/=/g, "").substring(0, 12);
    setRefCode(code);
    const count = parseInt(localStorage.getItem("baddie_ref_count") || "0", 10);
    setRefCount(count);
  }, [router]);

  const refLink = `https://chatpatti-baddie.vercel.app/?ref=${refCode}`;

  const bgClass = mode === "debate" ? "bg-red-600" : mode === "comedy" ? "bg-yellow-400" : mode === "romance" ? "bg-pink-500" : mode === "god" ? "bg-amber-600" : mode === "mind" ? "bg-gray-950" : "bg-white";
  const textClass = mode === "casual" || mode === "god" ? "text-gray-900" : "text-white";

  const handleLensImage = async (imageData: string) => {
    setLoading(true);
    setError("");
    setVentResponse(null);
    setResponseText("");
    try {
      const res = await fetch("/api/lens", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "CB Lens failed");
      setResponseText("🔍 CB Lens: " + data.description);
    } catch (err: any) {
      setError(err.message || "CB Lens failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVent = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setVentResponse(null);
    setResponseText("");
    setShowShare(false);
    const userMsg = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    try {
      const res = await fetch("/api/vent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, mode, lang, email: localStorage.getItem("baddie_user_email"), history: messages.slice(-6) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      let reply = "";
      if (data.vent?.response) {
        setVentResponse(data.vent.response);
        reply = data.vent.response.realTalk || "";
        setResponseText(reply);
      } else {
        reply = data.reply || "";
        setResponseText(reply);
      }
      setLastReply(reply);
      setShowShare(true);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => { setAiSpeaking(loading); }, [loading]);

  const shareText = encodeURIComponent(`🤖 Chatpattie Baddie says: "${lastReply.substring(0, 100)}"\n\nTry free: ${refLink}`);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${bgClass}`}>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 flex flex-col">
        {/* REFERRAL BANNER */}
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-green-700">
              <span className="font-semibold">📢 Share & grow the family</span>
              <p className="text-green-500 mt-0.5">{refCount} friends joined — keep sharing!</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(refLink); alert("Link copied!"); }} className="text-[10px] px-3 py-1.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
              📋 Copy
            </button>
          </div>
          <div className="mt-1.5 flex gap-1.5">
            <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[10px] py-1.5 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors">
              📱 WhatsApp
            </a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("CHATPATTIE BADDIE — 22 AI agents, free!")}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[10px] py-1.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors">
              ✈️ Telegram
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center shadow-lg transition-all duration-300 ${aiSpeaking ? "scale-110" : "scale-100"}`}>
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              {aiSpeaking ? (
                <><span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-ping" /><span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full" /></>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
              {aiSpeaking && (
                <><span className="absolute inset-0 rounded-full border-2 border-pink-300 animate-ping opacity-75" /><span className="absolute -inset-1.5 rounded-full border border-purple-300 animate-ping opacity-50" style={{animationDelay:"0.3s"}} /></>
              )}
            </div>
            <div>
              <h1 className={`text-lg font-semibold tracking-tight ${textClass}`}>
                {UI_STRINGS["CHATPATTIE BADDIE"][lang] || "CHATPATTIE BADDIE"}
              </h1>
              <p className={`text-[10px] ${textClass} opacity-60 flex items-center gap-1`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${aiSpeaking ? "bg-green-400 animate-pulse" : "bg-green-400"}`} />
                {aiSpeaking ? "Speaking..." : "AI is live"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={() => {
                if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
                setConfirmDelete(false); setMessages([]); setVentResponse(null); setResponseText(""); setError(""); setShowShare(false);
              }}
                className={`text-[10px] transition-colors flex items-center gap-1 ${confirmDelete ? "text-red-300" : "text-red-400 hover:text-red-300"}`}
                title={confirmDelete ? "Tap again to confirm" : "Delete chat history"}>
                {confirmDelete ? "⚠️ Sure?" : `🗑 ${Math.ceil(messages.length / 2)}`}
              </button>
            )}
            <LanguageSelector selected={lang} onSelect={setLang} />
            <a href="/delete-account" className="text-[9px] text-gray-300 hover:text-red-400 transition-colors" title="Delete account">🗑️</a>
          </div>
        </div>

        <ModalitySwitcher selected={mode} onSelect={(m) => { setMode(m); setVentResponse(null); setResponseText(""); setError(""); setMessages([]); setShowShare(false); }} />

        {mode && (
          <div className="flex-1 flex flex-col mt-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-500">
                    <span className="inline-flex gap-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay:"0.1s"}}>.</span><span className="animate-bounce" style={{animationDelay:"0.2s"}}>.</span></span>
                  </div>
                </div>
              )}
              {ventResponse && <BaddieResponse response={ventResponse} mode={mode} />}
              {responseText && !ventResponse && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-800 whitespace-pre-wrap">{responseText}</div>
                </div>
              )}
              {responseText && (
                <div className="w-full my-2">
                  <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-YOUR_PUBLISHER_ID" data-ad-slot="YOUR_AD_SLOT_ID" data-ad-format="auto" />
                </div>
              )}
              {showShare && lastReply && (
                <div className="flex justify-end gap-1.5">
                  <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2.5 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                    📱 Share
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(refLink); }} className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    📋 Copy
                  </button>
                </div>
              )}
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
          </div>
        )}

        {mode && (
          <div className="sticky bottom-0 pb-4 pt-2">
            <VentInput onSubmit={handleVent} disabled={loading} onLensImage={handleLensImage} />
          </div>
        )}
      </div>
    </div>
  );
}
