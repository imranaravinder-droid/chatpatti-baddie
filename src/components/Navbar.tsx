"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Clock, MessageCircle } from "lucide-react";

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
            <Link
              href="/chat"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                path === "/chat"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-1.5" />
              Chat
            </Link>
          )}
          {!isHome && (
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                path === "/dashboard"
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1.5" />
              Drama Log
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
