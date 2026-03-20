"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAllBlogs } from "@/Components/Blog/blog.api";
import { BlogItem } from "@/Components/Blog/blog.types";

const TREND_CACHE_KEY = "blogify.trending.v1";
const TREND_CACHE_TTL = 1000 * 60 * 5; // 5 min

const getTrendingScore = (blog: BlogItem) => blog.likes * 2 + blog.comments;

export default function TrendingBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Check local cache first
      try {
        const raw = localStorage.getItem(TREND_CACHE_KEY);
        if (raw) {
          const { timestamp, data } = JSON.parse(raw) as { timestamp: number; data: BlogItem[] };
          if (Date.now() - timestamp < TREND_CACHE_TTL && Array.isArray(data)) {
            setBlogs(data.slice(0, 5));
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      const response = await fetchAllBlogs();
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const sorted = [...response.blogs]
        .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
        .slice(0, 5);

      setBlogs(sorted);
      setLoading(false);

      try {
        localStorage.setItem(TREND_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: sorted }));
      } catch {
        // ignore
      }
    };

    load();
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section className="bg-white border-t border-gray-100 py-16 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          <div className="flex-1 h-px bg-gray-200 ml-2" />
        </div>

        <div className="space-y-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div className="relative h-16 w-24 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                  <div className="h-8 w-16 rounded-full bg-gray-200 shrink-0" />
                </div>
              ))
            : blogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition"
                >
                  {/* Rank */}
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-orange-50 text-orange-600"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>

                  {/* Cover */}
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={blog.coverImage || "/images/bg.avif"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-black transition-colors">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{blog.author} · {blog.category}</p>
                  </div>

                  {/* Engagement */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-700">{getTrendingScore(blog)}</p>
                    <p className="text-[10px] text-gray-400">score</p>
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Browse all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
