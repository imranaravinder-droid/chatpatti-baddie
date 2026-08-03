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
            CP <span className="text-pink-500">Baddie</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {!isHome && (
            <Link href="/chat" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/chat" ? "bg-pink-100 text-pink-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              💬 Chat
            </Link>
          )}
          <Link href="/cbtalk" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/cbtalk" ? "bg-sky-100 text-sky-700" : "text-sky-500 hover:text-sky-700 hover:bg-sky-50"}`}>
            🎥 AI Video Call
          </Link>
          <Link href="/youtube" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/youtube" ? "bg-red-100 text-red-700" : "text-red-500 hover:text-red-700 hover:bg-red-50"}`}>
            ▶️ YouTube
          </Link>
          <Link href="/instagram" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/instagram" ? "bg-amber-100 text-amber-700" : "text-amber-500 hover:text-amber-700 hover:bg-amber-50"}`}>
            📸 Prisha Insta
          </Link>
          <Link href="/dashboard" className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${path === "/dashboard" ? "bg-pink-100 text-pink-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
            📊 My History
          </Link>
        </div>
      </div>
    </nav>
  );
}
