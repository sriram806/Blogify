"use client";

import { useRouter } from "next/navigation";
import { SearchSuggestion } from "./blog.api";

interface Props {
  suggestions: SearchSuggestion[];
  loading: boolean;
  query: string;
  onClose: () => void;
}

export default function SearchSuggestions({ suggestions, loading, query, onClose }: Props) {
  const router = useRouter();

  if (query.length < 2) return null;

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/blog/${slug}`);
  };

  const getMatchLabel = (score?: number) => {
    if (!score || score <= 0) return "Match";
    if (score >= 0.85) return "High match";
    if (score >= 0.6) return "Good match";
    return "Relevant";
  };

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {loading ? (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          Searching…
        </div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</div>
      ) : (
        <ul>
          {suggestions.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => handleSelect(s.slug)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition ${
                  i !== suggestions.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Search icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <span className="flex-1 min-w-0 text-sm font-medium text-gray-800 truncate">
                  {s.title}
                </span>
                <span className="shrink-0 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {s.category}
                </span>
                <span className="shrink-0 text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  {getMatchLabel(s.score)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
