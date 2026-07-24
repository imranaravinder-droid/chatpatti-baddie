"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PinterestPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [pins, setPins] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
      const stored = localStorage.getItem("pinterest_pins");
      const token = localStorage.getItem("pinterest_token");
      if (stored && token) {
        try { setPins(JSON.parse(stored)); setConnected(true); } catch {}
      }
      // Try to fetch user info
      const storedUser = localStorage.getItem("pinterest_user");
      if (storedUser) {
        try { const u = JSON.parse(storedUser); setUsername(u.username || u.full_name || ""); } catch {}
      }
    }
  }, [router]);

  const loginWithPinterest = async () => {
    try {
      const res = await fetch("/api/pinterest/login");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to get Pinterest login URL");
    }
  };

  const refreshToken = async () => {
    const rt = localStorage.getItem("pinterest_refresh_token");
    if (!rt) return alert("No refresh token available. Reconnect Pinterest.");
    try {
      const res = await fetch("/api/pinterest/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rt }),
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("pinterest_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("pinterest_refresh_token", data.refresh_token);
        alert("Token refreshed successfully!");
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const disconnect = () => {
    localStorage.removeItem("pinterest_token");
    localStorage.removeItem("pinterest_refresh_token");
    localStorage.removeItem("pinterest_pins");
    localStorage.removeItem("pinterest_boards");
    localStorage.removeItem("pinterest_user");
    setPins([]);
    setConnected(false);
    setUsername("");
  };

  if (!authorized) return null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#0b0f19", color: "#f8fafc", minHeight: "100vh", padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#e60023" }}>📌</span> CHATPATTIE BADDIE Pinterest
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {connected && (
            <>
              <button onClick={refreshToken} style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                🔄 Refresh
              </button>
              <button onClick={disconnect} style={{ padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>

      {!connected ? (
        <div style={{ textAlign: "center", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "20px", padding: "60px 40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📌</div>
          <h3 style={{ margin: "0 0 8px 0" }}>Connect Your Pinterest</h3>
          <p style={{ color: "#94a3b8", margin: "0 0 24px 0", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            Link your Pinterest Business account to browse pins and boards in the app.
          </p>
          <button onClick={loginWithPinterest} style={{ padding: "14px 36px", background: "#e60023", color: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 16px rgba(230,0,35,0.3)" }}>
            🔗 Connect Pinterest
          </button>
          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "16px" }}>
            Set PINTEREST_CLIENT_ID and PINTEREST_CLIENT_SECRET in .env.local
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            {username && <>👤 <strong>{username}</strong> • </>}{pins.length} pins
          </p>
          {pins.length === 0 ? (
            <div style={{ textAlign: "center", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "16px", padding: "40px" }}>
              <p style={{ color: "#94a3b8" }}>No pins found on your account yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {pins.map((pin: any, i: number) => (
                <div key={pin.id || i} style={{ background: "#151c2c", borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden" }}>
                  <img src={pin.media?.images?.original?.url || pin.media?.images?.["120x120"]?.url || pin.image_url || ""} alt={pin.title || "Pin"} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pin.title || pin.note || "Untitled"}</div>
                    {pin.board_name && <div style={{ fontSize: "11px", color: "#94a3b8" }}>📋 {pin.board_name}</div>}
                    {pin.link && (
                      <a href={pin.link} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#6366f1", display: "block", marginTop: "4px", textDecoration: "none" }}>
                        🔗 Open
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
      </div>
    </div>
  );
}
