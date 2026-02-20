"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import BlogCard from "./BlogCard";

type Blog = {
  id: string;
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

const BlogSection = ({
  title,
  description,
  blogs,
  viewAllLink,
  badge,
}: BlogSectionProps) => {
  return (
    <section className="relative py-14 md:py-20 m-4">
      {/* Subtle background panel */}
      <div className="absolute inset-0 bg-gray-50/70" />

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          
          <div>
            <div className="flex items-center gap-3 mb-3">
              {badge && (
                <span className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-full tracking-wide">
                  {badge}
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              {title}
            </h2>

            {description && (
              <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Desktop View All */}
          <Link
            href={viewAllLink}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-full font-medium hover:bg-black hover:text-white hover:border-black transition-all"
          >
            View All
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden">
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
};

export default BlogSection;