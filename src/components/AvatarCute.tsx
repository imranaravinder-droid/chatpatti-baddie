"use client";

import type { AvatarExpression } from "@/components/Avatar3D";

const EXPRESSION_FACE: Record<AvatarExpression, string> = {
  neutral: "neutral",
  happy: "happy",
  thinking: "thinking",
  sad: "sad",
  surprised: "surprised",
  angry: "angry",
  speaking: "happy", // mouth NEVER animates — no lipsync
};

// Cute FEMALE avatar: big sparkling eyes, soft face, long hair + bow.
// Eyes change with expression, but the mouth is fixed/neutral — she does NOT move
// her mouth when speaking (the voice is heard, not lip-synced).
export default function AvatarCute({ expression, size = 280 }: { expression?: AvatarExpression; size?: number }) {
  const face = EXPRESSION_FACE[expression || "neutral"];
  const scale = size / 240;

  const eyeStyle: Record<string, string> = {
    neutral: "M-16,-2 C-9,-1 9,-1 16,-2",
    happy: "M-16,-4 C-10,-2 0,0 0,0 C0,0 10,-2 16,-4",
    thinking: "M-16,-3 C-9,-2 9,-2 16,-3",
    sad: "M-16 0 C-8 -1 8 -1 16 0",
    surprised: "M-16 -6 A6 6 0 1 1 16 -6 A6 6 0 1 1 -16 -6",
    angry: "M-16,-1 L0,-3 L16,-1 Z M-16 1 L0 -1 L16 1 Z",
  };
  const eye = eyeStyle[face] || eyeStyle.neutral;

  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ display: "block" }} aria-label={`avatar ${face}`}>
      <defs>
        <radialGradient id="cuteFaceGlow" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffd8c2" />
          <stop offset="100%" stopColor="#ffbaa8" />
        </radialGradient>
        <linearGradient id="cuteHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffbad5" />
          <stop offset="100%" stopColor="#e8a3b8" />
        </linearGradient>
      </defs>

      {/* Head */}
      <ellipse cx="120" cy="120" rx="85" ry="92" fill="url(#cuteFaceGlow)" />

      {/* Ears */}
      <circle cx="48" cy="118" r="10" fill="#ffd8c2" />
      <circle cx="192" cy="118" r="10" fill="#ffd8c2" />

      {/* Eyes — expressive sparkle, change with mood */}
      <g transform="translate(120,120)">
        <path d={eye} stroke="#152238" strokeWidth={Math.max(2.5, 7 * scale)} fill="none" strokeLinecap="round" />
        {/* sparkle highlight that moves slightly per mood */}
        <circle cx={face === "surprised" ? -4 : -6} cy={face === "surprised" ? -5 : -6} r={Math.max(1, 2.2 * scale)} fill="#4f8cff" />
        <circle cx={face === "surprised" ? 4 : 6} cy={face === "surprised" ? -5 : -6} r={Math.max(1, 2.2 * scale)} fill="#4f8cff" />
      </g>

      {/* Fixed neutral smile — always present, NEVER animates on "speaking" (no lipsync) */}
      <path d="M-16,0 C-8,6 8,6 16,0 C8,6 0,6 0,0 C0,6 -8,6 -16,0" transform="translate(120,180)" stroke="#b0414b" strokeWidth={Math.max(2.5, 7 * scale)} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Blush cheeks */}
      <ellipse cx="82" cy="138" rx={Math.max(10, 16 * scale)} ry={Math.max(5, 8 * scale)} fill="#ff9aa2" opacity="0.5" />
      <ellipse cx="158" cy="138" rx={Math.max(10, 16 * scale)} ry={Math.max(5, 8 * scale)} fill="#ff9aa2" opacity="0.5" />

      {/* Tiny cute nose — always visible, never moves */}
      <path d="M0,-2 L2,0 C3,1 3,3 2,4 C1,5 0,5 -1,4 C-2,4 -2,2 -1,1 Z" transform="translate(120,152)" fill="#d99a8c" opacity="0.7" />

      {/* Long hair + ribbon (feminine) */}
      <path
        d="M120,30 C80,30 55,75 55,120 C55,165 70,205 105,220 C110,222 120,224 120,224 C120,224 130,222 135,220 C170,205 185,165 185,120 C185,75 160,30 120,30 Z"
        fill="url(#cuteHair)"
      />
      {/* Ribbon on left */}
      <path d="M62,95 C55,100 55,112 62,117 C60,111 58,106 56,100 C58,106 60,112 62,117 Z" fill="#ff759a" />
      <path d="M178,95 C185,100 185,112 178,117 C180,111 182,106 184,100 C182,106 180,112 178,117 Z" fill="#ff759a" />
      <rect x="95" y="28" width="50" height="18" rx="9" fill="#ff759a" />
      <circle cx="100" cy="38" r={Math.max(4, 7 * scale)} fill="#fff" />
      <circle cx="140" cy="38" r={Math.max(4, 7 * scale)} fill="#fff" />
    </svg>
  );
}
