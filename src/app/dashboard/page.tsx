"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Vent } from "@/types";
import { Language } from "@/lib/lang";
import DramaLog from "@/components/DramaLog";
import VibeTracker from "@/components/VibeTracker";
import DeepDiveModal from "@/components/DeepDiveModal";
import LanguageSelector from "@/components/LanguageSelector";
import { Activity, Loader2, Swords, Laugh, Heart, MessageCircle } from "lucide-react";

const modeBg: Record<string, string> = {
  all: "bg-gray-100",
  casual: "bg-white",
  debate: "bg-red-600",
  comedy: "bg-yellow-400",
  romance: "bg-pink-500",
  god: "bg-amber-600",
};

const modeBtn: Record<string, { bg: string; shadow: string }> = {
  all: { bg: "bg-gray-500 text-white", shadow: "shadow-gray-300" },
  casual: { bg: "bg-gray-100 text-gray-700 border border-gray-300", shadow: "shadow-gray-300/30" },
  debate: { bg: "bg-red-500 text-white", shadow: "shadow-red-500/30" },
  comedy: { bg: "bg-yellow-500 text-white", shadow: "shadow-yellow-500/30" },
  romance: { bg: "bg-pink-500 text-white", shadow: "shadow-pink-500/30" },
  god: { bg: "bg-amber-500 text-white", shadow: "shadow-amber-500/30" },
};

const langs: Record<string, { title: string; subtitle: string; mood: string; history: string }> = {
  en: { title: "Your Drama Log", subtitle: "Every vent, every mood, every moment.", mood: "Mood Trend", history: "History" },
  hi: { title: "आपका ड्रामा लॉग", subtitle: "हर एहसास, हर मूड, हर पल।", mood: "मूड ट्रेंड", history: "इतिहास" },
  mr: { title: "तुझा ड्रामा लॉग", subtitle: "प्रत्येक भावना, प्रत्येक मूड, प्रत्येक क्षण.", mood: "मूड ट्रेंड", history: "इतिहास" },
  bn: { title: "আপনার ড্রামা লগ", subtitle: "প্রতি অনুভূতি, প্রতি মেজাজ, প্রতি মুহূর্ত।", mood: "মেজাজ প্রবণতা", history: "ইতিহাস" },
  gu: { title: "તમારો ડ્રામા લોગ", subtitle: "દરેક લાગણી, દરેક મૂડ, દરેક ક્ષણ.", mood: "મૂડ ટ્રેન્ડ", history: "ઇતિહાસ" },
  pa: { title: "ਤੁਹਾਡਾ ਡਰਾਮਾ ਲੌਗ", subtitle: "ਹਰ ਭਾਵਨਾ, ਹਰ ਮੂਡ, ਹਰ ਪਲ।", mood: "ਮੂਡ ਟ੍ਰੈਂਡ", history: "ਇਤਿਹਾਸ" },
  te: { title: "మీ డ్రామా లాగ్", subtitle: "ప్రతి భావన, ప్రతి మూడ్, ప్రతి క్షణం.", mood: "మూడ్ ట్రెండ్", history: "చరిత్ర" },
  kn: { title: "ನಿಮ್ಮ ಡ್ರಾಮಾ ಲಾಗ್", subtitle: "ಪ್ರತಿ ಭಾವನೆ, ಪ್ರತಿ ಮೂಡ್, ಪ್ರತಿ ಕ್ಷಣ.", mood: "ಮೂಡ್ ಟ್ರೆಂಡ್", history: "ಇತಿಹಾಸ" },
  ml: { title: "നിങ്ങളുടെ ഡ്രാമ ലോഗ്", subtitle: "ഓരോ വികാരവും, ഓരോ മൂഡും, ഓരോ നിമിഷവും.", mood: "മൂഡ് ട്രെൻഡ്", history: "ചരിത്രം" },
  ta: { title: "உங்கள் டிராமா லாக்", subtitle: "ஒவ்வொரு உணர்வும், ஒவ்வொரு மனநிலையும், ஒவ்வொரு கணமும்.", mood: "மனநிலை போக்கு", history: "வரலாறு" },
  ur: { title: "آپ کا ڈراما لاگ", subtitle: "ہر احساس، ہر مزاج، ہر پل۔", mood: "موڈ ٹرینڈ", history: "تاریخ" },
};

const modes: { key: string; label: string; icon: typeof Swords }[] = [
  { key: "all", label: "📊 All", icon: Activity },
  { key: "casual", label: "💬 Casual", icon: MessageCircle },
  { key: "debate", label: "⚔️ Debate", icon: Swords },
  { key: "comedy", label: "😂 Comedy", icon: Laugh },
  { key: "romance", label: "❤️ Romance", icon: Heart },
  { key: "god", label: "🕊️ God", icon: Heart },
];

export default function Dashboard() {
  const router = useRouter();
  const [vents, setVents] = useState<Vent[]>([]);
  const [selectedVent, setSelectedVent] = useState<Vent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [modeFilter, setModeFilter] = useState<string>("all");

  useEffect(() => {
    const email = localStorage.getItem("baddie_user_email");
    if (!email) {
      router.replace("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.slice(0, 2);
      if (["hi", "ar", "es", "ur"].includes(browserLang)) {
        setLang(browserLang as Language);
      }
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("baddie_user_email");
    fetch(`/api/history?email=${encodeURIComponent(email || "")}`)
      .then((res) => res.json())
      .then((data) => setVents(data.vents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isDarkBg = modeFilter === "debate" || modeFilter === "romance";
  const filteredVents = modeFilter === "all" ? vents : vents.filter(v => v.mode === modeFilter);
  const t = langs[lang] || langs.en;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 min-h-screen bg-gradient-to-br from-pink-50 to-white">
        <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 px-4 py-6 min-h-screen -mx-4 -mt-6 ${modeBg[modeFilter]} transition-all duration-500`}>
      <div className={`${isDarkBg ? "" : "px-4"}`}>
        <div className="flex justify-end">
          <LanguageSelector selected={lang} onSelect={setLang} />
        </div>

        <div className="text-center space-y-2">
          <h1 className={`text-2xl font-bold ${isDarkBg ? "text-white" : "text-gray-900"}`}>
            {t.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className={isDarkBg ? "text-yellow-300" : "text-pink-500"}>{t.title.split(" ").pop()}</span>
          </h1>
          <p className={`text-sm ${isDarkBg ? "text-white/70" : "text-gray-400"}`}>{t.subtitle}</p>
        </div>

        <div className="flex justify-center gap-2 flex-wrap mt-4">
          {modes.map(({ key, label, icon: Icon }) => {
            const active = modeFilter === key;
            const m = modeBtn[key] || modeBtn.all;
            return (
              <button
                key={key}
                onClick={() => setModeFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active ? `${m.bg} shadow-lg ${m.shadow}` : isDarkBg ? "border border-white/20 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className={`flex items-center gap-2 mb-2 mt-6`}>
          <span className="text-base">📈</span>
          <span className={`text-sm font-medium ${isDarkBg ? "text-white/80" : "text-gray-500"}`}>{t.mood}</span>
        </div>
        <VibeTracker vents={filteredVents} />

        <div className={`flex items-center gap-2 mb-2 mt-6`}>
          <span className="text-base">📜</span>
          <span className={`text-sm font-medium ${isDarkBg ? "text-white/80" : "text-gray-500"}`}>{t.history}</span>
        </div>
        <DramaLog vents={filteredVents} onSelect={setSelectedVent} />

        {selectedVent && (
          <DeepDiveModal vent={selectedVent} onClose={() => setSelectedVent(null)} />
        )}

      </div>
    </div>
  );
}
