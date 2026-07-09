"use client";

import { Mode } from "@/types";
import { Swords, Laugh, Heart } from "lucide-react";

interface Props {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

const modes: { key: Mode; label: string; icon: typeof Swords }[] = [
  { key: "debate", label: "Debate", icon: Swords },
  { key: "comedy", label: "Comedy", icon: Laugh },
  { key: "romance", label: "Romance", icon: Heart },
];

export default function ModalitySwitcher({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {modes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
            selected === key
              ? "bg-pink-500 text-white shadow-md shadow-pink-200"
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
