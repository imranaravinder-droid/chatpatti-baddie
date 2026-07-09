"use client";

import { Vent } from "@/types";
import DramaEntry from "./DramaEntry";
import { Clock } from "lucide-react";

interface Props {
  vents: Vent[];
  onSelect: (vent: Vent) => void;
}

export default function DramaLog({ vents, onSelect }: Props) {
  if (vents.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No drama yet. Go vent!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vents.map((vent) => (
        <DramaEntry key={vent.id} vent={vent} onClick={() => onSelect(vent)} />
      ))}
    </div>
  );
}
