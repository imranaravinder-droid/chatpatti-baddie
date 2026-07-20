"use client";

import { useState, useRef } from "react";
import { Send, Mic, MicOff, Camera } from "lucide-react";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  onLensImage?: (imageData: string) => void;
}

export default function VentInput({ onSubmit, disabled, onLensImage }: Props) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [lensLoading, setLensLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLensClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLensLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (onLensImage) {
        onLensImage(dataUrl);
      }
      setLensLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const canVoice =
    typeof window !== "undefined" &&
    !!( (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition );

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
    setVoiceError(null);

    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
      return;
    }

    if (!canVoice) {
      setVoiceError("Voice not supported on this browser. Try Chrome on Android.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let speechDetected = false;
    let timeoutId: any;

    recognition.onspeechstart = () => {
      speechDetected = true;
    };

    recognition.onresult = (event: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setText((prev) => (prev ? prev + " " + transcript : transcript));
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        setVoiceError("Microphone access denied. Allow mic and try again.");
      } else if (event.error === "no-speech") {
        if (!speechDetected) {
          setVoiceError("Tap mic, then speak clearly. Did you allow microphone?");
        }
      } else if (event.error === "aborted") {
        return;
      } else {
        setVoiceError(event.error === "audio-capture" ? "No mic found." : "Voice error. Try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
      timeoutId = setTimeout(() => {
        if (!speechDetected) {
          recognition.abort();
          setVoiceError("No speech heard. Tap mic, speak, then wait.");
          setIsListening(false);
        }
      }, 8000);
    } catch {
      setVoiceError("Could not start microphone.");
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
          placeholder="Spill the tea... what's on your mind? ☕💭"
        rows={4}
        disabled={disabled}
        className="w-full resize-none px-5 py-4 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-sm leading-relaxed disabled:opacity-50"
      />
      {voiceError && (
        <p className="text-xs text-red-500 px-5 pb-1">{voiceError}</p>
      )}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-2">
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
            type="button"
            onClick={handleLensClick}
            disabled={disabled || lensLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
              lensLoading
                ? "bg-purple-100 text-purple-500 animate-pulse"
                : "text-gray-400 hover:text-purple-600 hover:bg-purple-100"
            }`}
            title="CB Lens - Scan & Recognize"
          >
            <Camera className="w-4 h-4" />
            {lensLoading ? "Scanning..." : "CB Lens"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-pink-200"
        >
          <Send className="w-4 h-4" />
          Vent ✨
        </button>
      </div>
    </div>
  );
}
