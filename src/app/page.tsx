"use client";

import { useState, useCallback } from "react";
import { Mode, BaddieResponse as BaddieResponseType } from "@/types";
import { sampleVents } from "@/lib/mockData";
import VentInput from "@/components/VentInput";
import BaddieResponse from "@/components/BaddieResponse";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<Mode>("comedy");
  const [currentResponse, setCurrentResponse] = useState<BaddieResponseType | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasVented, setHasVented] = useState(false);

  const handleVent = useCallback(
    (text: string) => {
      setIsStreaming(true);
      setHasVented(true);
      setCurrentResponse(null);

      // Simulate streaming delay, then pick a mock response
      setTimeout(() => {
        const randomVent = sampleVents[Math.floor(Math.random() * sampleVents.length)];
        const response = { ...randomVent.response };

        // Adjust response slightly based on selected mode
        if (mode === "debate") {
          response.prompts = [
            "Oh really? And what's YOUR evidence for that logic?",
            "If your best friend told you this, what would YOU say to them?",
          ];
        } else if (mode === "comedy") {
          response.prompts = [
            "On a scale from 'it's fine' to 'I'm feral', where are we right now?",
            "If this was a reality TV show, what would the confessional say?",
          ];
        }

        setCurrentResponse(response);
        setIsStreaming(false);
      }, 1500);
    },
    [mode],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          CHATPATTIE <span className="text-pink-500">BADDIE</span>
        </h1>
        <p className="text-sm text-gray-400">
          Spill it all. The Baddie is listening.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <ModalitySwitcher selected={mode} onSelect={setMode} />
      </div>

      {/* Vent Input */}
      <VentInput onSubmit={handleVent} disabled={isStreaming} />

      {/* Streaming State */}
      {isStreaming && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm text-gray-400 animate-pulse">
            Baddie is processing your drama...
          </span>
        </div>
      )}

      {/* Response */}
      {currentResponse && <BaddieResponse response={currentResponse} isStreaming={false} />}

      {/* Empty State */}
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
