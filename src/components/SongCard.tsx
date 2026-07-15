"use client";

import { Music } from "lucide-react";
import { useState } from "react";

interface Props {
  lyrics: string;
  videoId?: string | null;
}

export default function SongCard({ lyrics, videoId }: Props) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 space-y-3">
      <div className="flex items-center gap-2">
        <Music className="w-5 h-5 text-purple-500" />
        <span className="font-semibold text-gray-800">🎵 Baddie Anthem</span>
      </div>
      {videoId && (
        <>
          {showPlayer ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowPlayer(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play Song ▶️
            </button>
          )}
        </>
      )}
      <pre className="text-sm text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">
        {lyrics}
      </pre>
    </div>
  );
}
