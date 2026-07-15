"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, TrendingUp, UserPlus, Loader2 } from "lucide-react";

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-16 text-gray-400 text-sm">Failed to load stats</div>;
  }

  const cards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-blue-500", bg: "bg-blue-50" },
    { icon: UserPlus, label: "Today's Signups", value: stats.todaySignups, color: "text-green-500", bg: "bg-green-50" },
    { icon: MessageSquare, label: "Total Vents", value: stats.totalVents, color: "text-pink-500", bg: "bg-pink-50" },
    { icon: TrendingUp, label: "Growth Rate", value: stats.todaySignups > 0 ? `${Math.round(stats.todaySignups / Math.max(stats.totalUsers, 1) * 100)}% today` : "0% today", color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">👑 Owner Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Your app growth at a glance 📊</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-gray-100`}>
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">📍 Where Users Come From</h2>
          {stats.bySource && stats.bySource.length > 0 ? (
            <div className="space-y-2">
              {stats.bySource.map((s: any) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{s.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-400 rounded-full"
                        style={{ width: `${(s.count / Math.max(...stats.bySource.map((x: any) => x.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">🎂 User Age Groups</h2>
          {stats.byAge && stats.byAge.length > 0 ? (
            <div className="space-y-2">
              {stats.byAge.map((a: any) => (
                <div key={a.age} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{a.age}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(a.count / Math.max(...stats.byAge.map((x: any) => x.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6 text-right">{a.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No data yet</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">🔒 Only you can see this page. Share the app to grow these numbers! 🚀</p>
    </div>
  );
}
