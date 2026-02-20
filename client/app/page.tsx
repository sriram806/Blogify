"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import BlogSection from "@/Components/Blog/BlogSection";

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
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden md:mx-4 lg:mx-8 rounded-3xl shadow-lg">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full text-sm font-medium mb-6">
                ✨ New articles every week
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Insights, stories, and ideas to
                <span className="block text-gray-500">
                  help you grow every day
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg text-gray-600 max-w-xl">
                Discover curated articles on technology, design, productivity,
                and personal growth. Learn from real experiences and practical insights.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  Explore Blogs
                  <FaArrowRight />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 font-medium hover:bg-gray-100 transition"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-8 text-sm text-gray-600">
                <div>
                  <p className="text-2xl font-semibold text-black">500+</p>
                  Articles
                </div>
                <div>
                  <p className="text-2xl font-semibold text-black">120k</p>
                  Readers
                </div>
                <div>
                  <p className="text-2xl font-semibold text-black">50+</p>
                  Writers
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="relative w-full -bottom-17 -right-5  h-70 md:h-98 lg:h-115 overflow-hidden">
                <Image
                  src="/images/hero-blog.webp"
                  alt="Blog Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Card (optional highlight) */}
              <div className="absolute -top-16 -left-2 bg-white shadow-lg rounded-xl p-4 hidden md:block cursor-pointer hover:shadow-2xl transition">
                <p className="text-sm text-gray-500">Featured Post</p>
                <p className="font-semibold">How AI is changing web development</p>
              </div>
              <div className="absolute top-8 left-16 bg-white shadow-lg rounded-xl p-4 hidden md:block cursor-pointer hover:shadow-2xl transition">
                <p className="text-sm text-gray-500">Featured Post</p>
                <p className="font-semibold">How AI is changing web development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <BlogSection
        title="Latest Articles"
        description="Fresh insights and stories published just for you"
        badge="LATEST"
        blogs={sampleBlogs.slice(0, 4)}
        viewAllLink="/blog?sort=latest"
      />

      {/* Popular Blogs Section */}
      <BlogSection
        title="Popular Now"
        description="What the community is reading and loving"
        badge="TRENDING UP"
        blogs={sampleBlogs.slice(1, 5)}
        viewAllLink="/blog?sort=popular"
      />

      {/* Recommended Blogs Section */}
      <BlogSection
        title="Recommended For You"
        description="Personalized picks based on your interests"
        badge="RECOMMENDED"
        blogs={sampleBlogs.slice(2, 6)}
        viewAllLink="/blog?sort=recommended"
      />

      {/* Trending Blogs Section */}
      <BlogSection
        title="Trending This Week"
        description="The most talked about articles in the community"
        badge="HOT"
        blogs={sampleBlogs.slice(3, 7)}
        viewAllLink="/blog?sort=trending"
      />

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-r from-black to-gray-800 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss an Article</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the best articles delivered to your inbox weekly.
          </p>
          <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}