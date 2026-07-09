"use client";

import { BookRec } from "@/types";
import { BookOpen } from "lucide-react";

interface Props {
  books: BookRec[];
}

export default function BookCard({ books }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-500" />
        <span className="font-semibold text-gray-800">Baddie Book Club</span>
      </div>
      <div className="space-y-3">
        {books.map((book, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-2xl flex-shrink-0">{book.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{book.title}</p>
              <p className="text-xs text-gray-400">by {book.author}</p>
              <p className="text-xs text-gray-600 mt-0.5 italic">{book.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
