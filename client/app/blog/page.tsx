"use client";

import { useMemo, useState } from "react";
import BlogFilters from "@/Components/Blog/BlogFilters";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { ALL_BLOGS } from "@/Components/Blog/blog.data";
import { BlogDateRange, BlogFilterState, BlogItem, BlogSortBy } from "@/Components/Blog/blog.types";

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

const maxReadTime = Math.max(...ALL_BLOGS.map((blog) => blog.readMinutes));

const INITIAL_FILTERS: BlogFilterState = {
  search: "",
  category: "all",
  author: "all",
  maxReadMinutes: maxReadTime,
  minLikes: 0,
  dateRange: "all",
  sortBy: "latest",
};

const PAGE_SIZE = 15;

const BlogsPage = () => {
  const [filters, setFilters] = useState<BlogFilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(ALL_BLOGS.map((blog) => blog.category))).sort(),
    []
  );

  const authors = useMemo(
    () => Array.from(new Set(ALL_BLOGS.map((blog) => blog.author))).sort(),
    []
  );

  const filteredBlogs = useMemo(() => {
    const now = new Date();
    const rangeDays = getDateRangeDays(filters.dateRange);

    const filtered = ALL_BLOGS.filter((blog) => {
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
  }, [filters]);

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

            {filteredBlogs.length > 0 ? (
              <div className="space-y-4">
                {paginatedBlogs.map((blog) => (
                  <BlogRowCard
                    key={blog.id}
                    id={blog.id}
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
