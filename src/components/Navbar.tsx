"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const path = usePathname();
  const isHome = path === "/";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          <span className="font-bold text-lg text-gray-900">
            CHATPATTIE <span className="text-pink-500">BADDIE</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {!isHome && (
            <Link href="/chat" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/chat" ? "bg-pink-100 text-pink-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              💬 Chat
            </Link>
          )}
          <Link href="/askm" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/askm" ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}`}>
            🎨 AskM
          </Link>
          <Link href="/spotlight" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/spotlight" ? "bg-green-100 text-green-700" : "text-green-600 hover:text-green-700 hover:bg-green-50"}`}>
            🎧 Music
          </Link>
          <Link href="/dashboard" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/dashboard" ? "bg-pink-100 text-pink-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
            📊 Log
          </Link>
        </div>
      </div>
    </nav>
  );
}
