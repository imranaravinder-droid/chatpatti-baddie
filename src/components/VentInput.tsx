"use client";

import { useState } from "react";
import { Send, Mic } from "lucide-react";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function VentInput({ onSubmit, disabled }: Props) {
  const [text, setText] = useState("");

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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          title="Voice input (coming soon)"
        >
          <Mic className="w-4 h-4" />
          Voice
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
