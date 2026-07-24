"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null;

  const searchSpotify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = data.tracks?.items || [];
      setTracks(items);
      if (items.length > 0) {
        setCurrentIndex(0);
        loadTrack(items[0]);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrack = (track: any) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (track?.preview_url) {
      const audio = new Audio(track.preview_url);
      audioRef.current = audio;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      setIsPlaying(true);
      audio.ontimeupdate = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); };
      audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
      audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const playTrack = (idx: number) => {
    setCurrentIndex(idx);
    loadTrack(tracks[idx]);
  };

  const playPrev = () => {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  };

  const playNext = () => {
    if (currentIndex < tracks.length - 1) playTrack(currentIndex + 1);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (!authorized) return null;

  return (
    <div style={styles.page}>
      {/* Custom Audio Player Card */}
      <div style={styles.playerCard}>
        <img
          src={currentTrack?.album?.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500"}
          alt="Album Cover"
          style={styles.albumArt}
        />
        <div style={styles.trackInfo}>
          <div style={styles.trackTitle}>{currentTrack?.name || "Select a track"}</div>
          <div style={styles.trackArtist}>{currentTrack?.artists?.map((a: any) => a.name).join(", ") || "Search to find music"}</div>
        </div>
        <div style={styles.progressContainer}>
          <div ref={progressRef} onClick={seek} style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          </div>
          <div style={styles.timeStamps}>
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
        <div style={styles.controls}>
          <button onClick={playPrev} style={styles.btn} disabled={currentIndex <= 0}>⏮</button>
          <button onClick={togglePlay} style={styles.btnPlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={playNext} style={styles.btn} disabled={currentIndex >= tracks.length - 1}>⏭</button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={searchSpotify} style={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search song, artist, or album..."
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.searchBtn}>{loading ? "..." : "Search"}</button>
      </form>

      {/* Results Grid */}
      <div style={styles.resultsGrid}>
        {tracks.map((track, idx) => (
          <div key={track.id} onClick={() => playTrack(idx)} style={{ ...styles.card, borderColor: currentIndex === idx ? "#6366f1" : "#1e293b" }}>
            <img src={track.album?.images[0]?.url || ""} alt={track.name} style={styles.cardImage} />
            <div style={styles.cardTitle}>{track.name}</div>
            <div style={styles.cardArtist}>{track.artists?.map((a: any) => a.name).join(", ")}</div>
            {track.preview_url ? (
              <audio controls src={track.preview_url} style={styles.audioControl} onClick={(e) => e.stopPropagation()} />
            ) : (
              <small style={{ color: "#666", marginTop: "6px" }}>No preview</small>
            )}
          </div>
        ))}
      </div>

      {tracks.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
          Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local, then search for songs.
        </p>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#0b0f19",
    color: "#f8fafc",
    minHeight: "100vh",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  playerCard: {
    background: "#151c2c",
    border: "1px solid #1e293b",
    borderRadius: "20px",
    padding: "28px",
    width: "100%",
    maxWidth: "420px",
    margin: "0 auto 24px auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  albumArt: {
    width: "100%",
    height: "260px",
    borderRadius: "14px",
    objectFit: "cover" as const,
    marginBottom: "20px",
  },
  trackInfo: { marginBottom: "20px" },
  trackTitle: { fontSize: "20px", fontWeight: 700, marginBottom: "4px" },
  trackArtist: { fontSize: "14px", color: "#94a3b8" },
  progressContainer: { marginBottom: "20px" },
  progressBar: {
    width: "100%",
    height: "6px",
    background: "#334155",
    borderRadius: "3px",
    cursor: "pointer",
    position: "relative" as const,
  },
  progressFill: {
    height: "100%",
    background: "#6366f1",
    borderRadius: "3px",
    transition: "width 0.1s",
  },
  timeStamps: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "6px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  btn: {
    background: "none",
    border: "none",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: "18px",
    padding: "10px",
  },
  btnPlay: {
    background: "#6366f1",
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    border: "none",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "25px",
    border: "1px solid #334155",
    backgroundColor: "#151c2c",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  searchBtn: {
    padding: "12px 24px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#151c2c",
    borderRadius: "10px",
    padding: "14px",
    border: "1px solid #1e293b",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  cardImage: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover" as const,
    borderRadius: "8px",
    marginBottom: "10px",
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardArtist: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  audioControl: {
    width: "100%",
    height: "32px",
    marginTop: "4px",
  },
};
