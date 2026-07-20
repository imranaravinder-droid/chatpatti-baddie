"use client";

import { useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface Props {
  text: string;
  autoSpeak?: boolean;
}

export default function VoiceOverButton({ text, autoSpeak }: Props) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (autoSpeak && text && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }, [text, autoSpeak]);

  const toggleSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }, [text, speaking]);

  return (
    <button
      onClick={toggleSpeech}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
        speaking
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200 scale-105"
          : "bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:shadow-md hover:from-pink-500 hover:to-purple-500"
      }`}
    >
      {speaking ? (
        <>
          <div className="flex gap-0.5 items-center">
            <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
            <span className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{animationDelay:"0.15s"}} />
            <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{animationDelay:"0.3s"}} />
          </div>
          <VolumeX className="w-4 h-4" /> Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" /> 🔈 AI Talk
        </>
      )}
    </button>
  );
}
