"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const ageRanges = ["Under 18", "18-24", "25-34", "35-44", "45+"];
const sources = ["Google Search", "Instagram", "YouTube", "WhatsApp", "Friend/Family", "Reddit", "Facebook", "Twitter/X", "Other"];

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, age, referralSource: source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("baddie_user_email", email);
      localStorage.setItem("baddie_user_name", name);
      router.replace("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center">
      <div className="text-center mb-6">
        <Sparkles className="w-10 h-10 text-pink-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900">💕 Chatpatti Baddie</h1>
        <p className="text-sm text-gray-400 mt-1">Your AI emotional companion 🤗</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Join the Family</h2>
          <p className="text-xs text-gray-400 mt-1">Help us grow by telling us a little about yourself ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Priya" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Age Range</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white">
              <option value="">Prefer not to say</option>
              {ageRanges.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">How did you find us?</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 bg-white">
              <option value="">Select...</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 disabled:opacity-50 transition-all">
            {loading ? "Signing up..." : "Join the Baddie Family 💕"}
          </button>

          <p className="text-xs text-gray-400 text-center">🔒 Your data is safe. We never spam or share.</p>
        </form>
      </div>
    </div>
  );
}
