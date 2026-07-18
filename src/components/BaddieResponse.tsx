"use client";

import { useEffect, useState } from "react";
import { BaddieResponse as BaddieResponseType, Mode } from "@/types";
import MoodTagBadge from "./MoodTagBadge";
import VoiceOverButton from "./VoiceOverButton";
import SongCard from "./SongCard";
import DanceSteps from "./DanceSteps";
import BookCard from "./BookCard";
import RecipeCard from "./RecipeCard";
import { Sparkles, Swords, Laugh, Heart, MessageCircle } from "lucide-react";

interface Props {
  response: BaddieResponseType;
  mode?: Mode;
  isStreaming?: boolean;
}

const modeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Sparkles; badge: string }> = {
  casual: { label: "Casual Talk", color: "#6b7280", bg: "bg-gray-100", border: "border-gray-300", icon: MessageCircle, badge: "bg-gray-500" },
  debate: { label: "Debate", color: "#c62828", bg: "bg-red-50", border: "border-red-300", icon: Swords, badge: "bg-red-500" },
  comedy: { label: "Comedy", color: "#f57f17", bg: "bg-yellow-50", border: "border-yellow-300", icon: Laugh, badge: "bg-yellow-500" },
  romance: { label: "Romance", color: "#c2185b", bg: "bg-pink-50", border: "border-pink-300", icon: Heart, badge: "bg-pink-500" },
};

export default function BaddieResponse({ response, mode, isStreaming }: Props) {
  const [visibleText, setVisibleText] = useState("");
  const fullText = `${response.realTalk}\n\n${response.prompts
    .map((p) => `• ${p}`)
    .join("\n")}`;
  const cfg = mode ? modeConfig[mode] : null;

  useEffect(() => {
    if (!isStreaming) {
      setVisibleText(fullText);
      return;
    }

    setVisibleText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [fullText, isStreaming]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {cfg && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider w-fit ${cfg.bg} ${cfg.border} border`}
          style={{ color: cfg.color }}
        >
          {cfg.icon && <cfg.icon className="w-3.5 h-3.5" />}
          {cfg.label}
        </div>
      )}

      <div className="flex items-center gap-3">
        <MoodTagBadge tag={response.moodTag} color={response.moodColor} />
        <VoiceOverButton text={fullText} />
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {visibleText}
              {isStreaming && visibleText.length < fullText.length && (
                <span className="inline-block w-1.5 h-4 bg-pink-400 ml-0.5 animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>



      {response.songLyrics && <SongCard lyrics={response.songLyrics} videoId={response.songVideoId} />}
      {response.danceSteps && response.danceSteps.length > 0 && (
        <DanceSteps steps={response.danceSteps} />
      )}
      {response.books && response.books.length > 0 && (
        <BookCard books={response.books} />
      )}
      {response.recipes && response.recipes.length > 0 && (
        <RecipeCard recipes={response.recipes} />
      )}
    </div>
  );
}
