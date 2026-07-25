"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [embedId, setEmbedId] = useState("4cOdK2wGLETKBW3PvgPWqT");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = data.tracks?.items || [];
      setTracks(items);
      if (items.length > 0) setEmbedId(items[0].id);
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        {tracks.map((t) => (
          <div key={t.id} onClick={() => setEmbedId(t.id)} style={{ background: "#181818", borderRadius: "8px", padding: "12px", cursor: "pointer", border: embedId === t.id ? "2px solid #1DB954" : "2px solid transparent", transition: "all 0.2s" }}>
            <img src={t.album?.images[0]?.url} alt={t.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }} />
            <div style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
            <div style={{ fontSize: "12px", color: "#b3b3b3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.artists?.map((a: any) => a.name).join(", ")}</div>
            {t.preview_url && <audio controls src={t.preview_url} style={{ width: "100%", height: "28px", marginTop: "6px" }} onClick={(e) => e.stopPropagation()} />}
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
