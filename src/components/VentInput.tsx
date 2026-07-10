"use client";

import { useState, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function VentInput({ onSubmit, disabled }: Props) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSubmit(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in your browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? prev + " " + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Spill the tea... what's on your mind?"
        rows={4}
        disabled={disabled}
        className="w-full resize-none px-5 py-4 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-sm leading-relaxed disabled:opacity-50"
      />
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button
          type="button"
          onClick={toggleVoice}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
            isListening
              ? "bg-pink-100 text-pink-600 animate-pulse"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          }`}
          title={isListening ? "Listening..." : "Voice input"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? "Listening..." : "Voice"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-pink-200"
        >
          <Send className="w-4 h-4" />
          Vent
        </button>
      </div>
    </div>
  );
}
