"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const e = localStorage.getItem("baddie_user_email");
    if (e) setEmail(e);
  }, []);

  const handleDelete = async () => {
    if (confirm !== "DELETE") return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      localStorage.removeItem("baddie_user_email");
      localStorage.removeItem("baddie_user_name");
      localStorage.removeItem("baddie_ref_code");
      localStorage.removeItem("baddie_ref_count");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="p-4 max-w-md mx-auto text-center mt-16">
        <span className="text-5xl">🗑️</span>
        <h1 className="text-xl font-bold text-gray-900 mt-4">Account Deleted</h1>
        <p className="text-sm text-gray-500 mt-2">All your data has been permanently removed.</p>
        <button onClick={() => router.push("/")} className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-16">
      <div className="text-center mb-6">
        <span className="text-5xl">🗑️</span>
        <h1 className="text-xl font-bold text-gray-900 mt-4">Delete Account</h1>
        <p className="text-sm text-gray-500 mt-2">This permanently deletes all your data — vents, history, everything.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="text-xs text-red-700 font-medium">⚠️ This action cannot be undone</p>
        <p className="text-xs text-red-500 mt-1">Email: {email}</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder='Type "DELETE" to confirm'
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <button
          onClick={handleDelete}
          disabled={confirm !== "DELETE" || loading}
          className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition-all"
        >
          {loading ? "Deleting..." : "Permanently Delete My Account"}
        </button>
        <button onClick={() => router.push("/chat")} className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
