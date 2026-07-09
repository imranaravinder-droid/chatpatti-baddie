"use client";

import { useEffect, useState } from "react";
import { BaddieResponse as BaddieResponseType } from "@/types";
import MoodTagBadge from "./MoodTagBadge";
import VoiceOverButton from "./VoiceOverButton";
import SongCard from "./SongCard";
import DanceSteps from "./DanceSteps";
import BookCard from "./BookCard";
import RecipeCard from "./RecipeCard";
import { Sparkles, Lightbulb } from "lucide-react";

interface Props {
  response: BaddieResponseType;
  isStreaming?: boolean;
}

export default function BaddieResponse({ response, isStreaming }: Props) {
  const [visibleText, setVisibleText] = useState("");
  const fullText = `${response.realTalk}\n\n${response.prompts
    .map((p) => `• ${p}`)
    .join("\n")}`;

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

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Lightbulb className="w-4 h-4" />
          Think About This
        </div>
        {response.prompts.map((prompt, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-pink-100"
          >
            {prompt}
          </div>
        ))}
      </div>

      {response.songLyrics && <SongCard lyrics={response.songLyrics} />}
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
