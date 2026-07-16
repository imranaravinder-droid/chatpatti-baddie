export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import VentInput from "@/components/VentInput";
import AdSense from "@/components/AdSense";
import LanguageSelector from "@/components/LanguageSelector";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import BaddieResponse from "@/components/BaddieResponse";
import { Language } from "@/lib/lang";
import { Mode, BaddieResponse as BaddieResponseType } from "@/types";

const UI_STRINGS: Record<string, Record<string, string>> = {
  "Vent to Baddie": {
    hi: "बैडी को बताओ",
    mr: "बॅडीला सांग",
    bn: "ব্যাডিকে বলো",
    gu: "બેડીને કહો",
    pa: "ਬੈਡੀ ਨੂੰ ਦੱਸੋ",
    ta: "பேடியிடம் சொல்",
    te: "బ్యాడీకి చెప్పు",
    kn: "ಬ್ಯಾಡಿಗೆ ಹೇಳು",
    ml: "ബാഡിയോട് പറയൂ",
    ur: "بیڈی کو بتائیں",
  },
  "Send": {
    hi: "भेजें",
    mr: "पाठवा",
    bn: "পাঠান",
    gu: "મોકલો",
    pa: "ਭੇਜੋ",
    ta: "அனுப்பு",
    te: "పంపు",
    kn: "ಕಳುಹಿಸು",
    ml: "അയയ്ക്കുക",
    ur: "بھیجیں",
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
  }, [router]);

  const bgClass = mode === "debate" ? "bg-red-600" : mode === "comedy" ? "bg-yellow-400" : mode === "romance" ? "bg-pink-500" : "bg-white";
  const textClass = mode === "casual" ? "text-gray-900" : "text-white";

  const handleVent = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setVentResponse(null);
    setResponseText("");
    try {
      const res = await fetch("/api/vent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, mode, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (data.vent?.response) {
        setVentResponse(data.vent.response);
        setResponseText(data.vent.response.realTalk || "The Baddie is listening...");
      } else {
        setResponseText(data.reply || "The Baddie is listening...");
      }
    } catch (err: any) {
      setError(err.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${bgClass}`}>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-5 h-5 ${textClass}`} />
            <h1 className={`text-lg font-semibold tracking-tight ${textClass}`}>
              {UI_STRINGS["Vent to Baddie"][lang] || "Vent to Baddie"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector selected={lang} onSelect={setLang} />
          </div>
        </div>

        <ModalitySwitcher selected={mode} onSelect={(m) => { setMode(m); setVentResponse(null); setResponseText(""); setError(""); }} />

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
              {ventResponse && (
                <BaddieResponse response={ventResponse} mode={mode} />
              )}
              {responseText && !ventResponse && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-800 whitespace-pre-wrap">
                    {responseText}
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
          </div>
        )}

        {mode && (
          <div className="sticky bottom-0 pb-4 pt-2">
            <VentInput onSubmit={handleVent} disabled={loading} />
          </div>
        )}
      </div>
      <AdSense slot="1234567890" format="horizontal" className="my-6" />
    </div>
  );
}
