"use client";

import { Vent, MoodTagColor } from "@/types";
import { moodTagColors } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface Props {
  vents: Vent[];
}

export default function VibeTracker({ vents }: Props) {
  const last7 = vents.slice(-7);

  const chartData = last7.map((v) => {
    const mood = moodTagColors.find((m) => m.tag === v.response.moodTag);
    return {
      date: format(new Date(v.createdAt), "MMM d"),
      mood: v.response.moodTag,
      color: mood?.color ?? "#888",
      value: moodTagColors.findIndex((m) => m.tag === v.response.moodTag) + 1 || 5,
    };
  });

  const moodEmoji: Record<string, string> = {
    Stressed: "😰", Glowing: "✨", "Down-Bad": "💔", Feral: "🔥",
    Unbothered: "😎", "In My Feels": "🥺", Healing: "🌱", Chaotic: "🌀",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
          <p className="text-gray-500 text-xs">{data.date}</p>
          <p className="font-semibold mt-0.5" style={{ color: data.color }}>
            {moodEmoji[data.mood] || "💬"} {data.mood}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold text-gray-800">Vibe Tracker</h3>
        <span className="text-xs text-gray-400">Last {chartData.length} vents</span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            barSize={32}
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={6}
                  fill={payload.color}
                  fillOpacity={0.7}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
