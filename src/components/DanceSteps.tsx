"use client";

import { Footprints } from "lucide-react";

interface Props {
  steps: string[];
}

export default function DanceSteps({ steps }: Props) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-5 border border-orange-100">
      <div className="flex items-center gap-2 mb-4">
        <Footprints className="w-5 h-5 text-orange-500" />
        <span className="font-semibold text-gray-800">Move That Body</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed pt-0.5">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
