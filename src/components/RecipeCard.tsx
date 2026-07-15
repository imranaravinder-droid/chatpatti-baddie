"use client";

import { RecipeRec } from "@/types";
import { ChefHat } from "lucide-react";

interface Props {
  recipes: RecipeRec[];
}

export default function RecipeCard({ recipes }: Props) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <ChefHat className="w-5 h-5 text-green-500" />
          <span className="font-semibold text-gray-800">🍳 Cook Your Feelings</span>
      </div>
      <div className="space-y-4">
        {recipes.map((recipe, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{recipe.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{recipe.reason}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {recipe.ingredients.map((ing, j) => (
                  <span
                    key={j}
                    className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-gray-500 border border-green-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
