"use client";

import { useState, useEffect } from "react";
import { Vent } from "@/types";
import DramaLog from "@/components/DramaLog";
import VibeTracker from "@/components/VibeTracker";
import DeepDiveModal from "@/components/DeepDiveModal";
import { Clock, Activity, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [vents, setVents] = useState<Vent[]>([]);
  const [selectedVent, setSelectedVent] = useState<Vent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setVents(data.vents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
      </div>
    );
  }

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

      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-500">Mood Trend</span>
      </div>
      <VibeTracker vents={vents} />

      <div className="flex items-center gap-2 mb-2 mt-6">
        <Clock className="w-4 h-4 text-pink-400" />
        <span className="text-sm font-medium text-gray-500">History</span>
      </div>
      <DramaLog vents={vents} onSelect={setSelectedVent} />

      {selectedVent && (
        <DeepDiveModal vent={selectedVent} onClose={() => setSelectedVent(null)} />
      )}
    </div>
  );
}
