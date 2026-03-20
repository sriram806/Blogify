"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogItem } from "./blog.types";
import { fetchRelatedBlogs } from "./blog.api";
import { useRecentlyRead } from "@/hooks/useRecentlyRead";

interface Props {
  blogId: string;
  currentSlug?: string;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 rounded-full bg-gray-200" />
      <div className="h-5 w-full rounded bg-gray-200" />
      <div className="h-4 w-4/5 rounded bg-gray-200" />
      <div className="flex items-center gap-2 pt-1">
        <div className="h-6 w-6 rounded-full bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function RelatedBlogs({ blogId, currentSlug }: Props) {
  const { recentlyRead } = useRecentlyRead();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasPersonalizationContext = recentlyRead.length > 0;

  useEffect(() => {
    if (!blogId) return;
    const recentCategories = Array.from(new Set(recentlyRead.map((item) => item.category))).slice(0, 6);
    const recentTitles = recentlyRead.map((item) => item.title).slice(0, 4);

    fetchRelatedBlogs(blogId, {
      categories: recentCategories,
      titles: recentTitles,
    }).then((results) => {
      // Extra client-side safety: exclude current blog
      const filtered = currentSlug
        ? results.filter((b) => b.slug !== currentSlug)
        : results;
      setBlogs(filtered.slice(0, 3));
      setLoading(false);
    });
  }, [blogId, currentSlug, recentlyRead]);

  if (!loading && blogs.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <h2 className="text-2xl font-bold text-gray-900 shrink-0">You might also like</h2>
        {hasPersonalizationContext && (
          <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-700">Personalized</span>
        )}
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={blog.coverImage || "/images/bg.avif"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-semibold">
                    {blog.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-black transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{blog.excerpt}</p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={blog.authorImage || "/images/author.avif"}
                        alt={blog.author}
                        width={22}
                        height={22}
                        className="rounded-full object-cover w-5 h-5"
                      />
                      <span className="text-xs text-gray-600 truncate max-w-22.5">{blog.author}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{blog.readMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
