"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PREVIEW_MAX = 12;

export default function SpotifyPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [embedId, setEmbedId] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleTimeUpdate = (i: number) => {
    const el = audioRefs.current.get(i);
    if (el && el.currentTime >= PREVIEW_MAX) {
      el.pause();
      el.currentTime = 0;
    }
  };

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = data.tracks?.items || [];
      setTracks(items);
      setEmbedId("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#121212", color: "#fff", minHeight: "100vh", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 20px 0" }}>🟢 Spotify — Search any song</h2>

      {embedId && (
        <div style={{ background: "#000", borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${embedId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: "12px" }}
          />
        </div>
      )}

      <form onSubmit={search} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any song in any language..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: "25px", border: "1px solid #333", background: "#242424", color: "#fff", fontSize: "15px", outline: "none" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "12px 24px", borderRadius: "25px", border: "none", background: "#1DB954", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {tracks.map((t, i) => (
          <div key={t.id} onClick={() => setEmbedId(t.id)} style={{ background: embedId === t.id ? "#1a2a1a" : "#181818", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", border: embedId === t.id ? "1px solid #1DB954" : "1px solid transparent" }}>
            <span style={{ color: "#1DB954", fontSize: "12px", minWidth: "16px" }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{t.name}</div>
              <div style={{ fontSize: "12px", color: "#b3b3b3" }}>{t.artists?.map((a: any) => a.name).join(", ")}</div>
            </div>
            {t.preview_url && (
              <audio
                controls
                src={t.preview_url}
                ref={(el) => { if (el) { audioRefs.current.set(i, el); } }}
                onTimeUpdate={() => handleTimeUpdate(i)}
                style={{ width: "120px", height: "28px" }}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        ))}
      </div>

      {tracks.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>Search any song — Hindi, English, Punjabi, Tamil, Telugu, any language.</p>
      )}

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}
