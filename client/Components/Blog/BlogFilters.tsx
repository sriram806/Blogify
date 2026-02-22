"use client";

import { BlogDateRange, BlogFilterState, BlogSortBy } from "./blog.types";

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
        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Search
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Title, excerpt, or keyword"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </label>

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