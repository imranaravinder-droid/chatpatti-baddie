"use client";

import { useState } from "react";
import { Language, languages, getLangName } from "@/lib/lang";
import { Languages } from "lucide-react";

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

export default function LanguageSelector({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <Languages className="w-3.5 h-3.5" />
        {getLangName(selected)}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 max-h-64 overflow-y-auto w-40">
            {languages.map(({ code, native }) => (
              <button
                key={code}
                onClick={() => { onSelect(code); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selected === code
                    ? "bg-pink-100 text-pink-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {native}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
