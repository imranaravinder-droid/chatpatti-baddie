"use client";

import { useState, useCallback } from "react";
import { Mode, BaddieResponse as BaddieResponseType } from "@/types";
import VentInput from "@/components/VentInput";
import BaddieResponse from "@/components/BaddieResponse";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<Mode>("comedy");
  const [currentResponse, setCurrentResponse] = useState<BaddieResponseType | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasVented, setHasVented] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVent = useCallback(
    async (text: string) => {
      setIsStreaming(true);
      setHasVented(true);
      setCurrentResponse(null);
      setError(null);

      try {
        const res = await fetch("/api/vent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, mode }),
        });

        if (!res.ok) {
          throw new Error("Failed to get response");
        }

        const data = await res.json();
        setCurrentResponse(data.vent.response);
      } catch (err) {
        setError("Something went wrong. The Baddie needs a moment.");
        console.error(err);
      } finally {
        setIsStreaming(false);
      }
    },
    [mode],
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          CHATPATTIE <span className="text-pink-500">BADDIE</span>
        </h1>
        <p className="text-sm text-gray-400">
          Spill it all. The Baddie is listening.
        </p>
      </div>

      <div className="flex justify-center">
        <ModalitySwitcher selected={mode} onSelect={setMode} />
      </div>

      <VentInput onSubmit={handleVent} disabled={isStreaming} />
      <p className="text-xs text-gray-400 text-center px-2">
        Keep it real but keep it safe — no credit cards, passwords, or personal IDs. Your vents are stored so the Baddie remembers your journey.
      </p>

      {isStreaming && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm text-gray-400 animate-pulse">
            Baddie is processing your drama...
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-xl p-4 text-sm text-red-600 text-center border border-red-100">
          {error}
        </div>
      )}

      {currentResponse && <BaddieResponse response={currentResponse} mode={mode} isStreaming={false} />}

      {!hasVented && !isStreaming && (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-pink-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">
            Pour your heart out. The Baddie doesn't judge.
          </p>
        </div>
      )}
    </div>
  );
}
