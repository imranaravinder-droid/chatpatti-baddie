"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function YoutubePage() {
  const authorized = useRequireAuth();
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [embedId, setEmbedId] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = data.items || [];
      setVideos(items);
      if (items.length > 0) setEmbedId(items[0].id.videoId);
    } catch {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0f0f0f", color: "#fff", minHeight: "100vh", padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 20px 0" }}>▶️ YouTube — Search any video</h2>

      {embedId && (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "20px", borderRadius: "12px", overflow: "hidden" }}>
          <iframe
            src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "12px" }}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <form onSubmit={search} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any video..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: "25px", border: "1px solid #333", background: "#242424", color: "#fff", fontSize: "15px", outline: "none" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "12px 24px", borderRadius: "25px", border: "none", background: "#ff0000", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {videos.map((v) => (
          <div
            key={v.id.videoId}
            onClick={() => setEmbedId(v.id.videoId)}
            style={{
              background: embedId === v.id.videoId ? "#1a1a1a" : "#181818",
              borderRadius: "6px",
              padding: "10px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: embedId === v.id.videoId ? "1px solid #ff0000" : "1px solid transparent",
            }}
          >
            <span style={{ color: "#ff0000", fontSize: "12px", minWidth: "16px" }}>{videos.indexOf(v) + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{v.snippet?.title}</div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>{v.snippet?.channelTitle}</div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>Search any video — music, tutorials, vlogs, anything.</p>
      )}

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}
