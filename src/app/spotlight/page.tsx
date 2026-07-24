"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SpotlightPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const DEFAULT_PLAYLIST = "spotify:playlist:0DrKS7q3KGGoCGGxjNs6Br";
  const [activeUri, setActiveUri] = useState(DEFAULT_PLAYLIST);
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "⚡ AI Core Active. Fullscreen mode ready. What track or vibe are we dropping today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(Date.now() * 0.005 + i * 0.3) * (canvas.height / 2.5) + canvas.height / 2;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "#10b981");
        gradient.addColorStop(0.5, "#3b82f6");
        gradient.addColorStop(1, "#ec4899");

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 3, height);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleAiCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: `✨ Processing command: "${userText}". Tuning frequency and loading spotlight tracks...` }
      ]);
    }, 400);
  };

  // Fetch all playlist tracks from our backend
  const fetchPlaylistTracks = async () => {
    try {
      const res = await fetch(`/api/spotify?playlist=${DEFAULT_PLAYLIST.split(":")[2]}`);
      const data = await res.json();
      if (data.tracks?.items) {
        setPlaylistTracks(data.tracks.items);
      }
    } catch (err) {
      console.error("Failed to fetch playlist tracks:", err);
    }
  };

  useEffect(() => { fetchPlaylistTracks(); }, []);

  const getEmbedUrl = (uri: string) => {
    const parts = uri.split(":");
    const type = parts[1] || "track";
    const id = parts[2] || uri;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  };

  const playTrack = (uri: string, name: string, artist: string) => {
    setActiveUri(uri);
  };

  if (!authorized) return null;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#090d16", color: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflow: "hidden", position: "relative" as const }} onClick={!isFullscreen ? enterFullscreen : undefined}>
      {!isFullscreen && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(9, 13, 22, 0.95)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ textAlign: "center", background: "#0f172a", padding: "40px 60px", borderRadius: "24px", border: "1px solid #1e293b", boxShadow: "0 0 50px rgba(59, 130, 246, 0.2)" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>⚡</div>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>POWER AI SPOTLIGHT</h1>
            <p style={{ color: "#94a3b8", margin: "0 0 20px 0" }}>Click anywhere to trigger Fullscreen Experience</p>
            <button onClick={(e) => { e.stopPropagation(); enterFullscreen(); }} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #2563eb, #10b981)", color: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)" }}>
              LAUNCH APP
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", height: "100vh", width: "100vw", gap: "1px", background: "#1e293b" }}>
        <div style={{ background: "#090d16", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px" }}>● SYSTEM ONLINE</span>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#f8fafc" }}>AI Music Spotlight</h2>
          </div>

          <div style={{ flex: 1, background: "#0f172a", borderRadius: "16px", border: "1px solid #1e293b", position: "relative", overflow: "hidden" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", bottom: "20px", left: "20px", pointerEvents: "none" }}>
              <h3 style={{ margin: 0, fontSize: "22px" }}>🎶 All Songs</h3>
              <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>CHATPATTIE BADDIE Playlist</p>
            </div>
          </div>

          <div style={{ background: "#000000", borderRadius: "12px", padding: "4px" }}>
            <iframe
              src={getEmbedUrl(activeUri)}
              width="100%"
              height="360"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "12px", minHeight: "360px" }}
            />
          </div>

          {playlistTracks.length > 0 && (
            <div style={{ background: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b", padding: "12px", maxHeight: "200px", overflowY: "auto" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#94a3b8", letterSpacing: "1px" }}>TRACK LIST</h4>
              {playlistTracks.map((track: any, i: number) => (
                <div key={track.id || i} onClick={() => playTrack(track.uri, track.name, track.artists?.map((a: any) => a.name).join(", "))} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px", borderRadius: "8px", cursor: "pointer", background: activeUri === track.uri ? "#1e293b" : "transparent", transition: "background 0.2s" }}>
                  <img src={track.album?.images[2]?.url || track.album?.images[0]?.url} alt="" style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: "13px", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.artists?.map((a: any) => a.name).join(", ")}</div>
                  </div>
                  <span style={{ color: activeUri === track.uri ? "#1DB954" : "#475569", fontSize: "12px" }}>{activeUri === track.uri ? "▶" : "♫"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "#0f172a", padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid #1e293b", marginBottom: "16px" }}>
            <span style={{ fontSize: "20px" }}>🤖</span>
            <h3 style={{ margin: 0, color: "#f8fafc" }}>Spotlight AI Agent</h3>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "14px", maxWidth: "85%", lineHeight: "1.5", background: msg.role === "user" ? "#2563eb" : "#1e293b", color: "#f8fafc" }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAiCommand} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI agent for songs, code, or dance steps..."
              style={{ flex: 1, padding: "12px 14px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none" }}
            />
            <button type="submit" style={{ padding: "12px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Execute
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
