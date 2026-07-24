"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AskmPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(`data:image/jpeg;base64,${data.image}`);
    } catch (err: any) {
      alert(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-4xl">🎨</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">AskM — Image Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Type anything and AI will create an image for you</p>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a cat in space with rainbow stars"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? "..." : "Create"}
        </button>
      </form>

      <div className="w-full my-4">
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>

      {imageUrl && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="relative">
            <img src={imageUrl} alt={prompt} className="w-full rounded-xl" />
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">"{prompt}"</p>
          <a
            href={imageUrl}
            download={`askm-${Date.now()}.jpg`}
            className="block w-full mt-3 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium text-center hover:bg-gray-800 transition-all"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}
