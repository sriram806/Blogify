"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import BlogCard from "./BlogCard";

type Blog = {
  id: string;
  slug?: string;
  authorId?: string;
  title: string;
  excerpt: string;
  author: string;
  authorImage?: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  likes?: number;
  comments?: number;
  views?: number;
};

type BlogSectionProps = {
  title: string;
  description?: string;
  blogs: Blog[];
  viewAllLink: string;
  badge?: string;
};

export default function BlogSection({
  title,
  description,
  blogs,
  viewAllLink,
  badge,
}: BlogSectionProps) {
  return (
    <section className="relative">

      {/* Elevated container */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div>
            {badge && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold tracking-wide mb-4 shadow-sm">
                {badge}
              </span>
            )}

            {title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Desktop View All */}
          <Link
            href={viewAllLink}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            View All
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.slug || blog.id}
              className="transition-transform duration-300 hover:-translate-y-1"
            >
              <BlogCard {...blog} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-10 md:hidden">
          <Link
            href={viewAllLink}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition"
          >
            View All Articles
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}