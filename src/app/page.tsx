"use client";

import { useState, useCallback, useEffect } from "react";
import { Mode, BaddieResponse as BaddieResponseType } from "@/types";
import { Language, detectLanguage } from "@/lib/lang";
import VentInput from "@/components/VentInput";
import BaddieResponse from "@/components/BaddieResponse";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import LanguageSelector from "@/components/LanguageSelector";
import AdSense from "@/components/AdSense";
import { Sparkles } from "lucide-react";

const modeBg: Record<string, string> = {
  casual: "bg-white",
  debate: "bg-red-600",
  comedy: "bg-yellow-400",
  romance: "bg-pink-500",
};

const modeAccent: Record<string, string> = {
  casual: "text-pink-500",
  debate: "text-yellow-300",
  comedy: "text-red-600",
  romance: "text-yellow-300",
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("casual");
  const [lang, setLang] = useState<Language>("en");
  const [currentResponse, setCurrentResponse] = useState<BaddieResponseType | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasVented, setHasVented] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.slice(0, 2);
      if (["hi", "ar", "es", "ur"].includes(browserLang)) {
        setLang(browserLang as Language);
      }
    }
  }, []);

  const handleVent = useCallback(
    async (text: string) => {
      setIsStreaming(true);
      setHasVented(true);
      setCurrentResponse(null);
      setError(null);

      const detectedLang = detectLanguage(text);

      try {
        const res = await fetch("/api/vent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, mode, lang: detectedLang }),
        });

        if (!res.ok) {
          throw new Error("Failed to get response");
        }

        const data = await res.json();
        setCurrentResponse(data.vent.response);
      } catch (err) {
        setError("Something went wrong. The Baddie needs a moment.");
        console.error(err);
      } finally {
        setIsStreaming(false);
      }
    },
    [mode],
  );

  const isDarkBg = mode === "debate" || mode === "romance";
  const accent = modeAccent[mode] || "text-pink-500";

  const ttl: Record<string, string> = {
    hi: "चटपटी बैडी", mr: "चटपटी बॅडी", bn: "চটপটি ব্যাডি", gu: "ચટપટી બેડી",
    pa: "ਚਟਪਟੀ ਬੈਡੀ", te: "చట్పట్టి బ్యాడీ", kn: "ಚಟ್ಪಟ್ಟಿ ಬ್ಯಾಡಿ",
    ml: "ചട്പട്ടി ബാഡി", ta: "சட்பட்டி பேடி", ur: "چٹپٹی بیڈی",
  };
  const sub: Record<string, string> = {
    hi: "दिल की बात कहो। बैडी सुन रही है।", mr: "मनातलं सांगा. बॅडी ऐकत आहे.",
    bn: "মনের কথা বলো। ব্যাডি শুনছে।", gu: "મનની વાત કહો. બેડી સાંભળે છે.",
    pa: "ਦਿਲ ਦੀ ਗੱਲ ਕਹੋ। ਬੈਡੀ ਸੁਣ ਰਹੀ ਹੈ।", te: "మనసు మాట చెప్పండి. బ్యాడీ వింటుంది.",
    kn: "ಮನಸ್ಸಿನ ಮಾತು ಹೇಳಿ. ಬ್ಯಾಡಿ ಕೇಳುತ್ತಿದೆ.", ml: "മനസ്സിലെ കാര്യം പറയൂ. ബാഡി കേൾക്കുന്നു.",
    ta: "மனசுல உள்ளதை சொல்லுங்க. பேடி கேட்குது.", ur: "دل کی بات کہو۔ بیڈی سن رہی ہے۔",
  };
  const wrn: Record<string, string> = {
    hi: "कोई क्रेडिट कार्ड, पासवर्ड या निजी जानकारी नहीं — सुरक्षित रहें।",
    bn: "কোন ক্রেডিট কার্ড, পাসওয়ার্ড বা ব্যক্তিগত তথ্য নয় — নিরাপদ থাকুন।",
    te: "క్రెడిట్ కార్డ్, పాస్వర్డ్ లేదా వ్యక్తిగత సమాచారం లేదు — సురక్షితంగా ఉండండి.",
    ta: "கிரெடிட் கார்டு, கடவுச்சொல் அல்லது தனிப்பட்ட தகவல்கள் இல்லை — பாதுகாப்பாக இருங்கள்.",
    ur: "کوئی کریڈٹ کارڈ، پاس ورڈ یا ذاتی معلومات نہیں — محفوظ رہیں۔",
  };
  const ldr: Record<string, string> = {
    hi: "बैडी आपका ड्रामा प्रोसेस कर रही है...", bn: "ব্যাডি আপনার ড্রামা প্রসেস করছে...",
    te: "బ్యాడీ మీ డ్రామాను ప్రాసెస్ చేస్తోంది...", ta: "பேடி உங்கள் டிராமாவை செயலாக்குகிறது...",
    ur: "بیڈی آپ کا ڈراما پروسیس کر رہی ہے...",
  };
  const emp: Record<string, string> = {
    hi: "दिल खोल के बोलो। बैडी जज नहीं करती।", bn: "মনের কথা বলো। ব্যাডি বিচার করে না।",
    te: "మనసు విప్పి చెప్పండి. బ్యాడీ తీర్పు చెప్పదు.", ta: "மனசை திறந்து சொல்லுங்க. பேடி தீர்ப்பு சொல்லாது.",
    ur: "دل کھول کر بولو۔ بیڈی جج نہیں کرتی۔",
  };
  const title = ttl[lang] || "CHATPATTIE BADDIE";
  const subtitle = sub[lang] || "Spill it all. The Baddie is listening.";
  const warning = wrn[lang] || "Keep it real but keep it safe — no credit cards, passwords, or personal IDs.";
  const loading = ldr[lang] || "Baddie is processing your drama...";
  const empty = emp[lang] || "Pour your heart out. The Baddie doesn't judge.";

  return (
    <div className={`space-y-6 min-h-screen px-4 py-6 -mx-4 -mt-6 ${modeBg[mode]} transition-all duration-500`}>
      <div className="flex justify-end">
        <LanguageSelector selected={lang} onSelect={setLang} />
      </div>

      <div className="text-center space-y-2">
        <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkBg ? "text-white" : "text-gray-900"}`}>
          {title.split(" ")[0]}{" "}
          <span className={accent}>
            {title.split(" ").slice(1).join(" ") || "BADDIE"}
          </span>
        </h1>
        <p className={`text-sm ${isDarkBg ? "text-white/70" : "text-gray-400"}`}>
          {subtitle}
        </p>
      </div>

      <div className="flex justify-center">
        <ModalitySwitcher selected={mode} onSelect={setMode} />
      </div>

      <VentInput onSubmit={handleVent} disabled={isStreaming} />
      <p className={`text-xs text-center px-2 ${isDarkBg ? "text-white/50" : "text-gray-400"}`}>
        {warning}
      </p>

      {isStreaming && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Sparkles className={`w-5 h-5 animate-pulse ${accent}`} />
          <span className={`text-sm animate-pulse ${isDarkBg ? "text-white/70" : "text-gray-400"}`}>
            {loading}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600 text-center border border-red-100">
          {error}
        </div>
      )}

      {currentResponse && <BaddieResponse response={currentResponse} mode={mode} isStreaming={false} />}

      <AdSense slot="1234567890" format="horizontal" className="my-6" />

      {!hasVented && (
        <div className="bg-gradient-to-r from-yellow-50 to-pink-50 rounded-xl p-4 text-center border border-yellow-100">
          <p className="text-sm font-medium text-gray-700">☕ Support Chatpatti Baddie</p>
          <p className="text-xs text-gray-400 mt-1">Help keep the Baddie free for everyone.</p>
          <a
            href="https://ko-fi.com/thechatpattiebaddie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full hover:bg-yellow-300 transition-colors"
          >
            Buy me a coffee
          </a>
        </div>
      )}

      {!hasVented && !isStreaming && (
        <div className="text-center py-16">
          <Sparkles className={`w-12 h-12 mx-auto mb-4 ${accent}`} />
          <p className={`text-sm ${isDarkBg ? "text-white/60" : "text-gray-400"}`}>
            {empty}
          </p>
        </div>
      )}
    </div>
  );
}
