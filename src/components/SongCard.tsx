"use client";

import { Music, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  lyrics: string;
}

export default function SongCard({ lyrics }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-800">Baddie Anthem</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-purple-500 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-sm text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">
        {lyrics}
      </pre>
    </div>
  );
}
