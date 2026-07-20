"use client";

import { useRouter } from "next/navigation";

export default function PremiumPage() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <div className="mb-6">
        <span className="text-5xl">🎙️</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">CB Talk</h1>
        <p className="text-sm text-gray-500 mt-1">Talk to AI like talking to a human</p>
      </div>
      <div className="flex justify-center gap-6 mb-8 text-sm text-gray-500">
        <div className="text-center"><div className="text-2xl mb-1">🎤</div><span>Speak</span></div>
        <div className="text-center"><div className="text-2xl mb-1">🤖</div><span>Understand</span></div>
        <div className="text-center"><div className="text-2xl mb-1">🔈</div><span>Reply</span></div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
        <p className="text-green-800 text-sm font-medium">✅ CB Talk is free for everyone</p>
        <p className="text-green-600 text-xs mt-2">No unlock needed. Voice mode works for all users.</p>
      </div>
      <button onClick={() => router.push("/chat")} className="w-full py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all">
        🗣️ Go to Chat
      </button>
    </div>
  );
}
