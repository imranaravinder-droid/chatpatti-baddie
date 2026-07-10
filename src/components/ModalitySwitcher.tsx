"use client";

import { Mode } from "@/types";
import { Swords, Laugh, Heart } from "lucide-react";

interface Props {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

const modes: { key: Mode; label: string; icon: typeof Swords; bg: string; shadow: string }[] = [
  { key: "debate", label: "Debate", icon: Swords, bg: "bg-red-500 text-white", shadow: "shadow-red-200" },
  { key: "comedy", label: "Comedy", icon: Laugh, bg: "bg-yellow-500 text-white", shadow: "shadow-yellow-200" },
  { key: "romance", label: "Romance", icon: Heart, bg: "bg-pink-500 text-white", shadow: "shadow-pink-200" },
];

export default function ModalitySwitcher({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {modes.map(({ key, label, icon: Icon, bg, shadow }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
            selected === key
              ? `${bg} shadow-md ${shadow}`
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
