"use client";

import { Music, ExternalLink, Youtube } from "lucide-react";

interface Props {
  lyrics: string;
  songName?: string;
}

export default function SongCard({ lyrics, songName }: Props) {
  const searchQuery = encodeURIComponent(songName || lyrics?.split("\n")[0] || "mood song");
  const youtubeUrl = `https://music.youtube.com/search?q=${searchQuery}`;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-800">🎵 Baddie Anthem</span>
        </div>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-full"
        >
          <Youtube className="w-3.5 h-3.5" />
          Listen on YouTube
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <pre className="text-sm text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">
        {lyrics}
      </pre>
    </div>
  );
}
