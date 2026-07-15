"use client";

import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  text: string;
}

export default function VoiceOverButton({ text }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const toggleSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }, [text, speaking]);

  return (
    <button
      onClick={toggleSpeech}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        speaking
          ? "bg-pink-500 text-white shadow-md shadow-pink-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {speaking ? (
        <>
          <VolumeX className="w-4 h-4" /> Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" /> 🔈 Hear Baddie
        </>
      )}
    </button>
  );
}
