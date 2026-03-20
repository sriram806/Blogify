"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRecentlyRead } from "@/hooks/useRecentlyRead";

export default function RecentlyRead() {
  const { recentlyRead, clearHistory, mounted } = useRecentlyRead();

  // Don't render on the server (localStorage is client-only)
  if (!mounted || recentlyRead.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          {/* Clock icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Continue Reading
        </h2>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-gray-400 hover:text-gray-700 transition"
        >
          Clear
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {recentlyRead.map((entry) => (
          <Link
            key={entry.id}
            href={`/blog/${entry.slug}`}
            className="flex-shrink-0 group flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition w-56"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={entry.coverImage || "/images/bg.avif"}
                alt={entry.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-black transition-colors">
                {entry.title}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{entry.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
