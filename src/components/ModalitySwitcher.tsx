"use client";

import { Mode } from "@/types";
import { Swords, Laugh, Heart, MessageCircle, Zap } from "lucide-react";

interface Props {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

const modes: { key: Mode; label: string; icon: typeof Swords; bg: string; shadow: string; outline: string }[] = [
  { key: "casual", label: "💬 Casual Talk", icon: MessageCircle, bg: "bg-gray-100 text-gray-700 border border-gray-300", shadow: "shadow-gray-300/30", outline: "border-gray-300 text-gray-400" },
  { key: "debate", label: "⚔️ Debate", icon: Swords, bg: "bg-red-500 text-white", shadow: "shadow-red-500/30", outline: "border-red-300 text-red-200" },
  { key: "comedy", label: "😂 Comedy", icon: Laugh, bg: "bg-yellow-500 text-white", shadow: "shadow-yellow-500/30", outline: "border-yellow-300 text-yellow-800" },
  { key: "romance", label: "❤️ Romance", icon: Heart, bg: "bg-pink-500 text-white", shadow: "shadow-pink-500/30", outline: "border-pink-300 text-pink-200" },
  { key: "god", label: "🕊️ God Mode", icon: Heart, bg: "bg-amber-500 text-white", shadow: "shadow-amber-500/30", outline: "border-amber-300 text-amber-200" },
  { key: "mind", label: "🧿 MIND READER BADDIE.AI", icon: Zap, bg: "bg-gray-950 text-cyan-300 border border-cyan-400", shadow: "shadow-cyan-400/30", outline: "border-cyan-400/30 text-cyan-400" },
];

export default function ModalitySwitcher({ selected, onSelect }: Props) {
  const isDarkBg = selected === "debate" || selected === "romance" || selected === "mind";
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {modes.map(({ key, label, icon: Icon, bg, shadow, outline }) => {
        const unselectedClass = key === "casual"
          ? "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
          : isDarkBg
            ? "border border-white/20 text-white/60 hover:bg-white/10"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200";
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
              selected === key
                ? `${bg} shadow-lg ${shadow}`
                : unselectedClass
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
