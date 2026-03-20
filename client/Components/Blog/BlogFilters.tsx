"use client";

import { useEffect, useRef, useState } from "react";
import { BlogDateRange, BlogFilterState, BlogSortBy } from "./blog.types";
import { fetchSearchSuggestions, SearchSuggestion } from "./blog.api";
import SearchSuggestions from "./SearchSuggestions";
import { useRecentlyRead } from "@/hooks/useRecentlyRead";

type BlogFiltersProps = {
  filters: BlogFilterState;
  categories: string[];
  authors: string[];
  maxAvailableReadMinutes: number;
  onChange: <K extends keyof BlogFilterState>(
    key: K,
    value: BlogFilterState[K]
  ) => void;
  onReset: () => void;
};

const SORT_OPTIONS: { value: BlogSortBy; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-commented", label: "Most Commented" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "shortest-read", label: "Shortest Read" },
  { value: "longest-read", label: "Longest Read" },
];

const DATE_OPTIONS: { value: BlogDateRange; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function BlogFilters({
  filters,
  categories,
  authors,
  maxAvailableReadMinutes,
  onChange,
  onReset,
}: BlogFiltersProps) {
  const { recentlyRead } = useRecentlyRead();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const quickInterestCategories = Array.from(new Set(recentlyRead.map((item) => item.category))).slice(0, 4);

  const fetchSuggestionsDebounced = (query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    setShowSuggestions(true);

    debounceTimer.current = setTimeout(async () => {
      const recentCategories = Array.from(new Set(recentlyRead.map((item) => item.category))).slice(0, 6);
      const recentTitles = recentlyRead.map((item) => item.title).slice(0, 4);
      const results = await fetchSearchSuggestions(q, {
        categories: recentCategories,
        titles: recentTitles,
      });
      setSuggestions(results);
      setSuggestionsLoading(false);
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Search with Suggestions */}
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <span>Search</span>
          {quickInterestCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickInterestCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onChange("category", category)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          <div ref={searchWrapperRef} className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                onChange("search", e.target.value);
                fetchSuggestionsDebounced(e.target.value);
              }}
              onFocus={() => {
                if (filters.search.trim().length >= 2) {
                  fetchSuggestionsDebounced(filters.search);
                }
              }}
              placeholder="Title, excerpt, or keyword"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
              autoComplete="off"
            />
            {showSuggestions && (
              <SearchSuggestions
                suggestions={suggestions}
                loading={suggestionsLoading}
                query={filters.search}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Category
          <select
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <p className="text-xs text-gray-500">Discover from short reads to deep dives (up to {maxAvailableReadMinutes} min available).</p>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Author
          <select
            value={filters.author}
            onChange={(e) => onChange("author", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="all">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Sort By
          <select
            value={filters.sortBy}
            onChange={(e) => onChange("sortBy", e.target.value as BlogSortBy)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Date Range
          <select
            value={filters.dateRange}
            onChange={(e) => onChange("dateRange", e.target.value as BlogDateRange)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          >
            {DATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Minimum Likes
          <input
            type="number"
            min={0}
            value={filters.minLikes}
            onChange={(e) => onChange("minLikes", Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </label>
      </div>
    </section>
  );
}
