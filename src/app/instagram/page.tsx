"use client";

import { useState, useEffect, Suspense } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useSearchParams } from "next/navigation";

function InstagramInner() {
  const authorized = useRequireAuth();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/instagram/profile");
      setData(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const error = searchParams.get("error");
  const connected = searchParams.get("connected");

  if (!authorized) return null;

  const media = data?.media || [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #f9fafb 0%, #fdf2f8 100%)", color: "#111827" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>

        {(error || connected) && (
          <div style={{ padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "0.9rem", fontWeight: 600, background: error ? "#fee2e2" : "#dcfce7", color: error ? "#991b1b" : "#166534" }}>
            {error ? `⚠️ ${error}` : "✅ Instagram connected!"}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📸</div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px" }}>Prisha Insta</h1>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0 0 16px" }}>
            Link Prisha's Instagram account to view the profile and recent posts right here.
          </p>

          {loading ? (
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Checking...</p>
          ) : data?.connected ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "12px" }}>
                {data.profile?.profile_picture_url && (
                  <img src={data.profile.profile_picture_url} alt="" style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }} />
                )}
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700 }}>@{data.profile?.username}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    {data.profile?.account_type?.toLowerCase()} · {data.profile?.media_count} posts
                  </div>
                </div>
              </div>
              <button onClick={async () => { await fetch("/api/instagram/disconnect", { method: "POST" }); window.location.href = "/instagram"; }} style={{ padding: "10px 20px", borderRadius: "25px", border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontWeight: 600, cursor: "pointer" }}>
                Disconnect
              </button>
            </>
          ) : (
            <a href="/api/instagram/auth" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "25px", background: "linear-gradient(135deg, #f59e0b, #ec4899)", color: "#fff", fontWeight: 700, textDecoration: "none" }}>
              Connect Prisha's Instagram
            </a>
          )}
        </div>

        {data?.connected && media.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0 0 12px" }}>Recent Posts</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
              {media.map((m: any) => (
                <a key={m.id} href={m.permalink} target="_blank" style={{ display: "block", aspectRatio: "1", borderRadius: "10px", overflow: "hidden", background: "#f3f4f6" }}>
                  <img src={m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url} alt={m.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstagramPage() {
  return (
    <Suspense fallback={null}>
      <InstagramInner />
    </Suspense>
  );
}
