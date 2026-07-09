"use client";

import { useParams } from "next/navigation";
import { getVentById } from "@/lib/mockData";
import MoodTagBadge from "@/components/MoodTagBadge";
import VoiceOverButton from "@/components/VoiceOverButton";
import SongCard from "@/components/SongCard";
import DanceSteps from "@/components/DanceSteps";
import BookCard from "@/components/BookCard";
import RecipeCard from "@/components/RecipeCard";
import { format } from "date-fns";
import { Sparkles, Lightbulb, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VentDetail() {
  const params = useParams();
  const vent = getVentById(params.id as string);

  if (!vent) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Vent not found</p>
        <Link href="/dashboard" className="text-pink-500 text-sm mt-2 inline-block">
          Back to Drama Log
        </Link>
      </div>
    );
  }

  const fullText = `${vent.response.realTalk}\n\n${vent.response.prompts.map((p) => `• ${p}`).join("\n")}`;
  const date = new Date(vent.createdAt);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-pink-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Drama Log
      </Link>

      <div className="space-y-5">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium mb-2">
            {format(date, "MMMM d, yyyy 'at' h:mm a")}
          </p>
          <p className="text-sm text-gray-600 font-medium mb-1.5">Your Vent</p>
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
              <div
                key={i}
                className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-pink-100"
              >
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
  );
}
