"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const playlists = [
  { id: "37i9dQZF1DXcBWIGoYBM5M", name: "Today's Top Hits", desc: "The biggest songs right now." },
  { id: "37i9dQZF1DX9XIFQuFvzSF", name: "Bollywood Butter", desc: "Best of Bollywood." },
  { id: "37i9dQZF1DWXJ5o03aOlZb", name: "Chill Vibes", desc: "Kick back and relax." },
  { id: "37i9dQZF1DX6GwdWRQMQpq", name: "Punjabi 101", desc: "Punjabi hits." },
  { id: "37i9dQZF1DWY7IeIP1cdjF", name: "Soulful Hindi", desc: "Hindi emotional & romantic." },
  { id: "37i9dQZF1DX0XUsuxWHRQd", name: "Sad Songs", desc: "For when you're in your feels." },
  { id: "37i9dQZF1DXbwRqtEuH2lq", name: "Energy Boost", desc: "High energy tracks." },
  { id: "37i9dQZF1DWTI0B69TStH2", name: "Indie India", desc: "Indian indie scene." },
  { id: "37i9dQZF1DXcF6B6QPhFDv", name: "Lofi Beats", desc: "Chill lofi hip hop." },
  { id: "37i9dQZF1DX9GRpeH4CL0S", name: "Yoga & Meditation", desc: "Calm your mind." },
  { id: "37i9dQZF1DX4o1oenSJRJd", name: "All Out 00s", desc: "2000s nostalgia." },
  { id: "37i9dQZF1DXbYM3nMM0oPk", name: "Mood Booster", desc: "Feel good tracks." },
];

export default function SpotlightPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [selected, setSelected] = useState(playlists[0].id);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🎧 Spotify Spotlight</h1>
        <p className="text-sm text-gray-500 mt-1">Pick a playlist and listen free.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {playlists.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selected === p.id
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${selected}?utm_source=generator&theme=0`}
          width="100%"
          height="480"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full"
        />
      </div>

      <div className="w-full my-4">
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}
