"use client";

import { useState } from "react";
import { sampleVents } from "@/lib/mockData";
import { Vent } from "@/types";
import DramaLog from "@/components/DramaLog";
import VibeTracker from "@/components/VibeTracker";
import DeepDiveModal from "@/components/DeepDiveModal";
import { Clock, Activity } from "lucide-react";

export default function Dashboard() {
  const [selectedVent, setSelectedVent] = useState<Vent | null>(null);
  const sorted = [...sampleVents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Your <span className="text-pink-500">Drama</span> Log
        </h1>
        <p className="text-sm text-gray-400">
          Every vent, every mood, every moment.
        </p>
      </div>

      {/* Vibe Tracker */}
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-500">Mood Trend</span>
      </div>
      <VibeTracker vents={sorted} />

      {/* Drama Log */}
      <div className="flex items-center gap-2 mb-2 mt-6">
        <Clock className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-500">History</span>
      </div>
      <DramaLog vents={sorted} onSelect={setSelectedVent} />

      {/* Deep Dive Modal */}
      {selectedVent && (
        <DeepDiveModal vent={selectedVent} onClose={() => setSelectedVent(null)} />
      )}
    </div>
  );
}
