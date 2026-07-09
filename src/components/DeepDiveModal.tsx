"use client";

import { Vent } from "@/types";
import MoodTagBadge from "./MoodTagBadge";
import VoiceOverButton from "./VoiceOverButton";
import SongCard from "./SongCard";
import DanceSteps from "./DanceSteps";
import BookCard from "./BookCard";
import RecipeCard from "./RecipeCard";
import { format } from "date-fns";
import { X, Sparkles, Lightbulb } from "lucide-react";
import { useEffect } from "react";

interface Props {
  vent: Vent;
  onClose: () => void;
}

export default function DeepDiveModal({ vent, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const fullText = `${vent.response.realTalk}\n\n${vent.response.prompts.map((p) => `• ${p}`).join("\n")}`;
  const date = new Date(vent.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-gray-900">Deep Dive</h2>
            <p className="text-xs text-gray-400">{format(date, "MMMM d, yyyy 'at' h:mm a")}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 font-medium mb-2">Your Vent</p>
            <p className="text-sm text-gray-800 leading-relaxed">{vent.content}</p>
          </div>

          <div className="flex items-center gap-3">
            <MoodTagBadge tag={vent.response.moodTag} color={vent.response.moodColor} />
            <VoiceOverButton text={fullText} />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-800 leading-relaxed">{vent.response.realTalk}</p>
            </div>
          </div>

          {vent.response.prompts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Lightbulb className="w-4 h-4" />
                Think About This
              </div>
              {vent.response.prompts.map((prompt, i) => (
                <div key={i} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-pink-100">
                  {prompt}
                </div>
              ))}
            </div>
          )}

          {vent.response.songLyrics && <SongCard lyrics={vent.response.songLyrics} />}
          {vent.response.danceSteps && vent.response.danceSteps.length > 0 && (
            <DanceSteps steps={vent.response.danceSteps} />
          )}
          {vent.response.books && vent.response.books.length > 0 && (
            <BookCard books={vent.response.books} />
          )}
          {vent.response.recipes && vent.response.recipes.length > 0 && (
            <RecipeCard recipes={vent.response.recipes} />
          )}
        </div>
      </div>
    </div>
  );
}
