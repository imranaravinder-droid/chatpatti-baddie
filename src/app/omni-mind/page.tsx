"use client";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function OmniMindPage() {
  const authorized = useRequireAuth();
  if (!authorized) return null;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe src="/omni-mind.html" style={{ width: "100%", height: "100%", border: "none" }} />
    </div>
  );
}
