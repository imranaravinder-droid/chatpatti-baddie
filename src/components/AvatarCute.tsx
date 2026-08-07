"use client";

import type { AvatarExpression } from "@/components/Avatar3D";

const EXPRESSION_FACE: Record<AvatarExpression, string> = {
  neutral: "neutral",
  happy: "happy",
  thinking: "thinking",
  sad: "sad",
  surprised: "surprised",
  angry: "angry",
  speaking: "happy",
};

export default function AvatarCute({ expression, size = 280 }: { expression?: AvatarExpression; size?: number }) {
  const face = EXPRESSION_FACE[expression || "neutral"];
  const scale = size / 240;

  const eyes: Record<string, string> = {
    happy: "M-18,-8 C-10,-6 -2,-7 0,0 C2,-7 10,-6 18,-8",
    neutral: "M-18 -10 C-9 -8 -2 -7 0 0 C2 -7 9 -8 18 -10",
    thinking: "M-18 -10 C-9 -9 -2 -8 0 0 C2 -8 9 -9 18 -10",
    sad: "M-18 -4 C-10 -3 0 -2 0 0 C0 -2 10 -3 18 -4",
    surprised: "M-16 0 A6 6 0 1 1-14 0 A6 6 0 1 1-16 0 M2 0 a6 6 0 1 1-2 0 a6 6 0 1 1 2 0",
    angry: "M-18 -6 L-2 0 L-18 -2 Z M2 0 L18 -2 L2 -6 Z",
  };

  const mouth: Record<string, string> = {
    neutral: "M-18,20 Q0,30 18,20",
    happy: "M-20,18 C-10,28 10,28 20,18",
    thinking: "M-18,22 Q0,30 18,22",
    sad: "M-20,28 Q0,26 20,28",
    surprised: "M0,18 a10,10 0 1,0 0.1,0 z",
    angry: "M-20,26 L0,16 L20,26 Z",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      style={{ display: "block" }}
      aria-label={`avatar ${face}`}
    >
      {/* Face glow */}
      <radialGradient id="faceGlow" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffe0b2" />
        <stop offset="100%" stopColor="#f9c5a1" />
      </radialGradient>
      <ellipse cx="120" cy="120" rx="90" ry="100" fill="url(#faceGlow)" />
      {/* Ears */}
      <circle cx="40" cy="120" r="10" fill="#f9c5a1" />
      <circle cx="200" cy="120" r="10" fill="#f9c5a1" />
      {/* Eyes (fixed — never moves the mouth, but eyes express) */}
      <g transform="translate(120,140)">
        <path d={eyes[face]} stroke="#1a1a2e" strokeWidth={Math.max(2, 6 * scale)} fill="none" strokeLinecap="round" />
      </g>
      {/* Mouth — only for expression, never animated to "speaking" */}
      <path
        d={mouth[face]}
        transform="translate(120,165)"
        stroke="#b0414b"
        strokeWidth={Math.max(2, 6 * scale)}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
