"use client";

import { useState } from "react";

const VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Soft)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella (Warm)" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Alice (Sweet)" },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Dorothy (Deep)" },
  { id: "ODq5zmih8GrVes37Dizd", name: "Michael (Calm)" },
];

export default function CBTalkPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), voice_id: voice }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Generation failed");
        return;
      }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch {
      alert("Failed to generate audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0b0f19", color: "#f8fafc", minHeight: "100vh", padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem" }}>🎙️ CB TALK <span style={{ color: "#38bdf8" }}>FREE</span></h2>
      <p style={{ color: "#94a3b8", margin: "0 0 24px 0" }}>Type anything — hear it in a lifelike voice. Free, no signup needed.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to speak... use [softly], [laughs], [whisper] for emotion cues"
          rows={4}
          style={{ padding: "14px", borderRadius: "10px", border: "1px solid #1e293b", background: "#0b0f19", color: "#f8fafc", fontSize: "15px", resize: "vertical", outline: "none" }}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ color: "#94a3b8", fontSize: "14px" }}>Voice:</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e293b", background: "#0b0f19", color: "#f8fafc", fontSize: "14px", outline: "none" }}
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={generate}
          disabled={loading || !text.trim()}
          style={{ padding: "14px 24px", background: "linear-gradient(135deg, #38bdf8, #0284c7)", color: "#0f172a", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", opacity: loading || !text.trim() ? 0.7 : 1 }}
        >
          {loading ? "Generating..." : "🎙️ Speak It"}
        </button>
      </div>

      {audioUrl && (
        <div style={{ marginTop: "20px", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
          <audio controls src={audioUrl} style={{ width: "100%" }} autoPlay />
          <p style={{ color: "#34d399", fontSize: "13px", marginTop: "8px" }}>✅ Generated — right-click the player to download</p>
        </div>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}
