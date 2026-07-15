"use client";

import { Vent } from "@/types";
import MoodTagBadge from "./MoodTagBadge";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

interface Props {
  vent: Vent;
  onClick: () => void;
}

export default function DramaEntry({ vent, onClick }: Props) {
  const date = new Date(vent.createdAt);
  const preview = vent.content.length > 100 ? vent.content.slice(0, 100) + "..." : vent.content;

  const moodEmoji: Record<string, string> = {
    Stressed: "😰", Glowing: "✨", "Down-Bad": "💔", Feral: "🔥",
    Unbothered: "😎", "In My Feels": "🥺", Healing: "🌱", Chaotic: "🌀",
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{moodEmoji[vent.response.moodTag] || "💬"}</span>
            <MoodTagBadge tag={vent.response.moodTag} color={vent.response.moodColor} size="sm" />
            <span className="text-xs text-gray-400">
              {format(date, "MMM d, h:mm a")}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {preview}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-pink-400 transition-colors mt-1 flex-shrink-0" />
      </div>
    </button>
  );
}
