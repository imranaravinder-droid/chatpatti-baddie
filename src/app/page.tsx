"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MessageCircle, Brain, BookOpen, Globe, Lightbulb, Shield, Users, Zap, Heart } from "lucide-react";

const ageRanges = ["Under 18", "18-24", "25-34", "35-44", "45+"];
const sources = ["Google Search", "Instagram", "YouTube", "WhatsApp", "Friend/Family", "Reddit", "Facebook", "Twitter/X", "Other"];

const features = [
  { icon: MessageCircle, title: "CHATPATTIE BADDIE", desc: "22+ AI agents ready 24/7 — study tutor, space guide, music companion, life diary, comedy buddy, and more. No judgment, just support." },
  { icon: Brain, title: "22 AI Agents", desc: "Study Master, English Coach, Space Guide, Music Companion, Life Coach, Personality Analyst, Creative Studio, CB Lens, and 14 more specialists." },
  { icon: Globe, title: "24 Indian Languages", desc: "Speak in Hindi, Tamil, Bengali, Marathi, Gujarati, Punjabi, Urdu, and 17 more languages. Your AI Family speaks your language." },
  { icon: BookOpen, title: "Global Study Master", desc: "Homework help, exam prep, CBSE/NCERT/ICSE/IB/IGCSE support. Any subject, any class, any board in the world." },
  { icon: Lightbulb, title: "Field Fusion Ideas", desc: "Every response includes a creative cross-field idea — Space + Agriculture, Robotics + Music, Medicine + Art." },
  { icon: Shield, title: "100% Private", desc: "Your data stays yours. Email-based history means only you see your past conversations." },
  { icon: Users, title: "Join CHATPATTIE BADDIE", desc: "Thousands already use CHATPATTIE BADDIE daily to learn, grow, discover music, explore space, and improve themselves." },
  { icon: Zap, title: "Instant AI Responses", desc: "Powered by Groq AI (llama-3.3-70b). No rate limits, no waiting. Real-time responses in any language." },
];

const modes = [
  { emoji: "💬", label: "Casual Talk", color: "bg-gray-100" },
  { emoji: "🔥", label: "Debate Mode", color: "bg-red-50" },
  { emoji: "😂", label: "Comedy Mode", color: "bg-yellow-50" },
  { emoji: "❤️", label: "Romance Mode", color: "bg-pink-50" },
  { emoji: "🧿", label: "MIND READER BADDIE.AI", color: "bg-gray-950 text-cyan-300 border-2 border-cyan-400 shadow-lg shadow-cyan-400/30" },
];

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("ref");
    if (r) setRef(r);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body: any = { name, email, age, referralSource: source };
      if (ref) body.ref = ref;
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("baddie_user_email", email);
      localStorage.setItem("baddie_user_name", name);
      if (data.referralCode) localStorage.setItem("baddie_ref_code", data.referralCode);
      router.replace("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center">
      {/* HERO */}
      <div className="text-center mb-8 max-w-2xl">
        <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 rainbow-shower leading-tight">💕 CHATPATTIE BADDIE</h1>
        <p className="text-base text-gray-500 mt-3 max-w-md mx-auto">22+ AI agents — chat, create images, study, get advice. All in one. Free, private, speaks your language.</p>
      </div>

      {/* SIGNUP */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md" id="signup">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">✨ Join CHATPATTIE BADDIE</h2>
          <p className="text-xs text-gray-400 mt-1">Sign up free. 22+ AI agents in 10 seconds.</p>
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
            {loading ? "Signing up..." : "Meet Your AI Family 💕"}
          </button>

          <p className="text-xs text-gray-400 text-center">🔒 Your data is safe. We never spam or share.</p>
        </form>
      </div>

      {/* FEATURES */}
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">🌟 Meet Your AI Family</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <f.icon className="w-7 h-7 text-pink-500 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODES */}
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">🎭 5 Powerful Modes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modes.map((m, i) => (
            <div key={i} className={`${m.color} rounded-xl p-4 text-center border border-gray-100`}>
              <span className="text-2xl">{m.emoji}</span>
              <p className="text-xs font-medium text-gray-800 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4 max-w-lg mx-auto">Plus 22 AI agents: Study Master, Space Guide, Music Companion, Life Coach, English Coach, Creative Studio, CB Lens, Personality Analyst, Discovery AI, Field Inventor, Global Discovery Network, and more.</p>
      </div>

      {/* ASKM */}
      <div className="w-full max-w-4xl mt-16">
        <div className="grid grid-cols-1 gap-4">
          <a href="/askm" className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-3xl">🎨</span>
            <h3 className="font-bold text-lg mt-2">AskM — AI Image Generator</h3>
            <p className="text-sm text-blue-200 mt-1">Type anything, AI creates an image instantly. Free, no limits.</p>
            <span className="inline-block mt-3 text-xs font-medium text-yellow-300">Create Now →</span>
          </a>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">🚀 How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Sign Up Free", desc: "Enter your name and email. No credit card needed. Your data stays private." },
            { step: "2", title: "Choose Your Mode", desc: "Pick from Casual, Debate, Comedy, or Romance. Or let AI auto-detect your mood." },
            { step: "3", title: "Vent, Learn & Grow", desc: "Talk, ask questions, get homework help, analyze your personality, or just laugh." },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{s.step}</div>
              <h3 className="font-semibold text-sm text-gray-900">{s.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* USE CASES */}
      <div className="w-full max-w-4xl mt-16 mb-16">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">🎯 Who Needs CHATPATTIE BADDIE?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: "🧑‍🎓", title: "Students", desc: "Homework help, exam prep, CBSE/NCERT/IB/IGCSE support, study plans, practice questions for any subject." },
            { emoji: "💼", title: "Professionals", desc: "English communication coach, interview prep, public speaking practice, business email writing, career guidance." },
            { emoji: "🎨", title: "Creators", desc: "Image prompts, video scripts, design ideas, logo creation, sketching tutorials, storyboards, content planning." },
            { emoji: "🧠", title: "Self-Improvers", desc: "Personality analysis, career discovery, productivity tips, Big Five assessment, growth suggestions." },
            { emoji: "🌍", title: "Language Learners", desc: "24 Indian languages, English fluency, grammar correction, Hinglish to English, IELTS/TOEFL/PTE prep." },
            { emoji: "👨‍👩‍👧‍👦", title: "Everyone Needs CHATPATTIE BADDIE", desc: "Your 22 AI agents are here — study help, space exploration, music discovery, life diary, motivation, personality growth, and more. No judgment, just support." },
          ].map((u, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl">{u.emoji}</span>
              <h3 className="font-semibold text-sm text-gray-900 mt-1">{u.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
