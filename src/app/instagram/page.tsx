"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstagramPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("baddie_user_email")) {
      router.replace("/");
    } else {
      setAuthorized(true);
      const stored = localStorage.getItem("instagram_posts");
      const token = localStorage.getItem("instagram_token");
      if (stored && token) {
        try { setPosts(JSON.parse(stored)); setConnected(true); } catch {}
      }
    }
  }, [router]);

  const loginWithInstagram = async () => {
    try {
      const res = await fetch("/api/instagram/login");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to get Instagram login URL");
    }
  };

  const disconnect = () => {
    localStorage.removeItem("instagram_token");
    localStorage.removeItem("instagram_user_id");
    localStorage.removeItem("instagram_posts");
    setPosts([]);
    setConnected(false);
  };

  if (!authorized) return null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#0b0f19", color: "#f8fafc", minHeight: "100vh", padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>📸</span> CHATPATTIE BADDIE Instagram
        </h2>
        {connected && (
          <button onClick={disconnect} style={{ padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
            Disconnect
          </button>
        )}
      </div>

      {!connected ? (
        <div style={{ textAlign: "center", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "20px", padding: "60px 40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📸</div>
          <h3 style={{ margin: "0 0 8px 0" }}>Connect Your Instagram</h3>
          <p style={{ color: "#94a3b8", margin: "0 0 24px 0", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            Link your Instagram to browse your posts and media directly in the app.
          </p>
          <button onClick={loginWithInstagram} style={{ padding: "14px 36px", background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)", color: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 16px rgba(221,42,123,0.3)" }}>
            🔗 Connect Instagram
          </button>
          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "16px" }}>
            Set INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET in .env.local
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>{posts.length} posts loaded.</p>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "16px", padding: "40px" }}>
              <p style={{ color: "#94a3b8" }}>No posts found on your account.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
              {posts.map((post: any, i: number) => (
                <div key={post.id || i} style={{ background: "#151c2c", borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden" }}>
                  {post.media_type === "VIDEO" ? (
                    <video src={post.media_url} controls style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                  ) : (
                    <img src={post.media_url} alt={post.caption || "Post"} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.caption || "No caption"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{new Date(post.timestamp).toLocaleDateString()}</div>
                    {post.permalink && (
                      <a href={post.permalink} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#6366f1", display: "block", marginTop: "6px", textDecoration: "none" }}>
                        🔗 Open in Instagram
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
