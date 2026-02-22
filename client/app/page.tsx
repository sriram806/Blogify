"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import FeaturedPage from "@/Components/Home/FeaturedPage";
import TrendingPage from "@/Components/Home/TrendingPage";
import RecommandPage from "@/Components/Home/RecommandPage";
import NewsletterSection from "@/Components/Home/NewsLetter";
import { useAuth } from "@/Components/Auth/AuthProvider";

// Mock data - replace with actual data from API
const sampleBlogs = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    excerpt: "Learn how to use React Hooks to manage state and side effects in functional components.",
    author: "John Doe",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "2 days ago",
    readTime: "5 min",
    category: "React",
    likes: 245,
    comments: 32,
    views: 1200,
  },
  {
    id: "2",
    title: "The Future of Web Development",
    excerpt: "Exploring emerging technologies and trends that will shape web development in 2024.",
    author: "Jane Smith",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "4 days ago",
    readTime: "8 min",
    category: "Web Dev",
    likes: 512,
    comments: 78,
    views: 2500,
  },
  {
    id: "3",
    title: "TypeScript Best Practices",
    excerpt: "Master TypeScript with these essential best practices and patterns for scalable applications.",
    author: "Mike Johnson",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "1 week ago",
    readTime: "10 min",
    category: "TypeScript",
    likes: 389,
    comments: 56,
    views: 1800,
  },
  {
    id: "4",
    title: "CSS Grid Advanced Layouts",
    excerpt: "Create complex and responsive layouts with CSS Grid without framework overhead.",
    author: "Sarah Lee",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "5 days ago",
    readTime: "7 min",
    category: "CSS",
    likes: 267,
    comments: 41,
    views: 950,
  },
  {
    id: "5",
    title: "Mastering Node.js Streams",
    excerpt: "Efficiently handle large data transfers and process files with Node.js streams.",
    author: "David Park",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "3 days ago",
    readTime: "12 min",
    category: "Node.js",
    likes: 445,
    comments: 67,
    views: 2100,
  },
  {
    id: "6",
    title: "Next.js App Router Deep Dive",
    excerpt: "Understanding the new app router in Next.js 13+ and how to build modern applications.",
    author: "Emily Chen",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "1 day ago",
    readTime: "9 min",
    category: "Next.js",
    likes: 678,
    comments: 92,
    views: 3200,
  },
  {
    id: "7",
    title: "Python Data Analysis with Pandas",
    excerpt: "Learn powerful data manipulation and analysis techniques using Python's Pandas library.",
    author: "Alex Rivera",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "6 days ago",
    readTime: "11 min",
    category: "Python",
    likes: 523,
    comments: 74,
    views: 2700,
  },
  {
    id: "8",
    title: "GraphQL vs REST APIs",
    excerpt: "Comparing GraphQL and REST APIs to help you choose the right approach for your project.",
    author: "Rachel Gold",
    authorImage: "/images/author.avif",
    coverImage: "/images/bg.avif",
    publishedAt: "3 days ago",
    readTime: "6 min",
    category: "API",
    likes: 412,
    comments: 58,
    views: 1600,
  },
];

export default function HomePage() {
  const { greeting, setGreeting } = useAuth();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/blog?search=${search}`;
  };

  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => setGreeting(null), 3500);
    return () => clearTimeout(timer);
  }, [greeting, setGreeting]);

  return (
    <>
      {greeting && (
        <div className="fixed top-20 right-4 z-50 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-black">{greeting}</p>
          <p className="text-gray-600">Glad to have you here.</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden drop-shadow-sm">

        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative container mx-auto px-5 sm:px-6 md:px-8 sm:py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">

            {/* LEFT CONTENT */}
            <div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-black/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6">
                ✨ New articles every week
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Insights, stories, and ideas to
                <span className="block text-gray-500">
                  help you grow every day
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
                Discover curated articles on technology, design, productivity,
                and personal growth. Learn from real experiences and practical insights.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="mt-6 flex items-center bg-white/80 px-4 py-3 rounded-full border border-gray-200 shadow-sm max-w-lg"
              >
                <input
                  type="text"
                  placeholder="Search blogs, topics, or authors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm sm:text-base w-full"
                />
                <button
                  type="submit"
                  className="ml-3 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                  Search
                </button>
              </form>

              {/* CTA */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition"
                >
                  Explore Blogs
                  <FaArrowRight />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-gray-300 text-sm sm:text-base font-medium hover:bg-gray-100 transition"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-8 sm:mt-10 flex flex-wrap gap-6 sm:gap-8 text-xs sm:text-sm text-gray-600">
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-black">500+</p>
                  Articles
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-black">120k</p>
                  Readers
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-black">50+</p>
                  Writers
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">

              {/* Hero Image */}
              <div className="relative w-full h-65 sm:h-80 md:h-95 lg:h-115 rounded-xl sm:rounded-2xl mt-28 overflow-hidden">
                <Image
                  src="/images/hero-blog.png"
                  alt="Blog Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Card 1 */}
              <div className="
  absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5
  bg-white shadow-lg rounded-lg sm:rounded-xl
  p-2.5 sm:p-3 md:p-4
  max-w-32 sm:max-w-42.5 md:max-w-50
  cursor-pointer hover:shadow-2xl transition
">
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
                  Featured Post
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold leading-snug">
                  How AI is changing web development
                </p>
              </div>

              {/* Floating Card 2 */}
              <div className="
  absolute bottom-3 sm:bottom-4 md:bottom-5 right-3 sm:right-4 md:right-5
  bg-white shadow-lg rounded-lg sm:rounded-xl
  p-2.5 sm:p-3 md:p-4
  max-w-32 sm:max-w-42.5 md:max-w-50
  cursor-pointer hover:shadow-2xl transition
">
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
                  Trending
                </p>
                <p className="text-[11px] sm:text-xs md:text-sm font-semibold leading-snug">
                  Top UI trends in 2026
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <FeaturedPage />
      <TrendingPage />
      <RecommandPage />
      <NewsletterSection />
    </>
  );
}