"use client";

import { useEffect, useMemo, useState } from "react";
import BlogFilters from "@/Components/Blog/BlogFilters";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { BlogDateRange, BlogFilterState, BlogItem, BlogSortBy } from "@/Components/Blog/blog.types";
import { fetchAllBlogs } from "@/Components/Blog/blog.api";

const BLOGS_CACHE_KEY = "blogify.blog.list.cache.v1";
const BLOGS_CACHE_TTL_MS = 1000 * 60 * 2;

const getDateRangeDays = (range: BlogDateRange): number | null => {
  switch (range) {
    case "24h":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    default:
      return null;
  }
};

const sortBlogs = (blogs: BlogItem[], sortBy: BlogSortBy) => {
  const sorted = [...blogs];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.publishedOn).getTime() - new Date(b.publishedOn).getTime()
      );
    case "most-liked":
      return sorted.sort((a, b) => b.likes - a.likes);
    case "most-commented":
      return sorted.sort((a, b) => b.comments - a.comments);
    case "most-viewed":
      return sorted.sort((a, b) => b.views - a.views);
    case "shortest-read":
      return sorted.sort((a, b) => a.readMinutes - b.readMinutes);
    case "longest-read":
      return sorted.sort((a, b) => b.readMinutes - a.readMinutes);
    case "latest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime()
      );
  }
};

const INITIAL_FILTERS: BlogFilterState = {
  search: "",
  category: "all",
  author: "all",
  maxReadMinutes: 60,
  minLikes: 0,
  dateRange: "all",
  sortBy: "latest",
};

const PAGE_SIZE = 15;
const SKELETON_ROWS = 6;

const BlogRowSkeleton = () => (
  <article className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 animate-pulse">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="h-44 md:h-36 md:w-56 shrink-0 rounded-xl bg-gray-200" />

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-20 rounded-full bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-14 rounded bg-gray-200" />
        </div>

        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-10 rounded bg-gray-200" />
            <div className="h-4 w-10 rounded bg-gray-200" />
            <div className="h-4 w-10 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  </article>
);

const readCachedBlogs = () => {
  if (typeof window === "undefined") return [] as BlogItem[];

  try {
    const raw = localStorage.getItem(BLOGS_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as { timestamp?: number; blogs?: BlogItem[] };
    if (!parsed?.timestamp || !Array.isArray(parsed.blogs)) return [];

    const isFresh = Date.now() - parsed.timestamp <= BLOGS_CACHE_TTL_MS;
    return isFresh ? parsed.blogs : [];
  } catch {
    return [];
  }
};

const writeCachedBlogs = (blogs: BlogItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      BLOGS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), blogs })
    );
  } catch {
    // ignore cache write errors
  }
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState<BlogFilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      const cachedBlogs = readCachedBlogs();
      const hasCachedBlogs = cachedBlogs.length > 0;

      if (hasCachedBlogs) {
        const cachedMaxReadTime = Math.max(1, ...cachedBlogs.map((blog) => blog.readMinutes));
        setBlogs(cachedBlogs);
        setFilters((prev) => ({ ...prev, maxReadMinutes: cachedMaxReadTime }));
        setLoading(false);
      }

      const response = await fetchAllBlogs();
      if (!response.ok) {
        if (!hasCachedBlogs) {
          setErrorMessage(response.message || "Unable to load blogs right now.");
          setBlogs([]);
          setLoading(false);
        }
        return;
      }

      const loadedBlogs = response.blogs;
      writeCachedBlogs(loadedBlogs);
      const maxReadTime = Math.max(1, ...loadedBlogs.map((blog) => blog.readMinutes));
      setBlogs(loadedBlogs);
      setFilters((prev) => ({ ...prev, maxReadMinutes: maxReadTime }));
      setLoading(false);
    };

    load();
  }, []);

  const maxReadTime = useMemo(
    () => Math.max(1, ...blogs.map((blog) => blog.readMinutes)),
    [blogs]
  );

  const categories = useMemo(
    () => Array.from(new Set(blogs.map((blog) => blog.category))).sort(),
    [blogs]
  );

  const authors = useMemo(
    () => Array.from(new Set(blogs.map((blog) => blog.author))).sort(),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const now = new Date();
    const rangeDays = getDateRangeDays(filters.dateRange);

    const filtered = blogs.filter((blog) => {
      const normalizedSearch = filters.search.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${blog.title} ${blog.excerpt} ${blog.category} ${blog.author}`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory = filters.category === "all" || blog.category === filters.category;
      const matchesAuthor = filters.author === "all" || blog.author === filters.author;
      const matchesReadTime = blog.readMinutes <= filters.maxReadMinutes;
      const matchesLikes = blog.likes >= filters.minLikes;

      const matchesDateRange =
        rangeDays === null ||
        (now.getTime() - new Date(blog.publishedOn).getTime()) / (1000 * 60 * 60 * 24) <= rangeDays;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAuthor &&
        matchesReadTime &&
        matchesLikes &&
        matchesDateRange
      );
    });

    return sortBlogs(filtered, filters.sortBy);
  }, [filters, blogs]);

  const handleFilterChange = <K extends keyof BlogFilterState>(
    key: K,
    value: BlogFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBlogs.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredBlogs]);

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-5 sm:px-6 md:px-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="lg:w-[24%]">
            <div className="lg:sticky lg:top-24">
              <BlogFilters
                filters={filters}
                categories={categories}
                authors={authors}
                maxAvailableReadMinutes={maxReadTime}
                onChange={handleFilterChange}
                onReset={() => {
                  setFilters(INITIAL_FILTERS);
                  setCurrentPage(1);
                }}
              />
            </div>
          </aside>

          <div className="lg:w-[76%]">
            {errorMessage && !loading && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {!loading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{paginatedBlogs.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> filtered blogs
                </p>
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> /{" "}
                  <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <BlogRowSkeleton key={`blog-skeleton-${index}`} />
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="space-y-4">
                {paginatedBlogs.map((blog) => (
                  <BlogRowCard
                    key={blog.id}
                    id={blog.id}
                    slug={blog.slug}
                    authorId={blog.authorId}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    author={blog.author}
                    authorImage={blog.authorImage}
                    coverImage={blog.coverImage}
                    publishedAt={blog.publishedAt}
                    readTime={`${blog.readMinutes} min`}
                    category={blog.category}
                    likes={blog.likes}
                    comments={blog.comments}
                    views={blog.views}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
                <h3 className="text-xl font-semibold text-gray-900">No blogs found</h3>
                <p className="text-gray-600 mt-2">Try adjusting one or more filter options.</p>
              </div>
            )}

            {filteredBlogs.length > 0 && (
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogsPage;
