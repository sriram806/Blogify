"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaFire } from "react-icons/fa";

type TrendingBlog = {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    coverImage: string;
    views: number;
};

const trendingBlogs: TrendingBlog[] = [
  {
    id: "future-of-ai-products",
    title: "The Next Wave of AI Products Changing Everyday Life",
    excerpt:
      "From personal assistants to smart automation, explore how AI products are reshaping how we live and work.",
    category: "Technology",
    publishedAt: "Mar 5, 2026",
    coverImage: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    views: 21450,
  },
  {
    id: "street-food-culture-india",
    title: "Street Food Culture: Why Local Flavors Define Cities",
    excerpt:
      "A journey through vibrant street food scenes and the stories behind the world’s most loved dishes.",
    category: "Food",
    publishedAt: "Mar 3, 2026",
    coverImage: "https://plus.unsplash.com/premium_photo-1695297515417-5aeacd5dd313?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RyZWV0JTIwZm9vZCUyMGluZGlhfGVufDB8fDB8fHww",
    views: 17820,
  },
  {
    id: "modern-digital-culture",
    title: "How Digital Communities Are Shaping Modern Culture",
    excerpt:
      "Online communities are redefining identity, creativity, and collaboration in the digital age.",
    category: "Culture",
    publishedAt: "Mar 2, 2026",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    views: 14310,
  },
  {
    id: "remote-work-travel",
    title: "Remote Work & Travel: Building a Career Without Borders",
    excerpt:
      "Discover how professionals are blending work with travel and designing flexible lifestyles.",
    category: "Travel",
    publishedAt: "Mar 1, 2026",
    coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhdmVsfGVufDB8fDB8fHww",
    views: 12980,
  },
  {
    id: "minimalist-lifestyle",
    title: "Minimalist Living: Why Less Is Becoming More",
    excerpt:
      "A practical guide to simplifying your lifestyle and focusing on what truly matters.",
    category: "Lifestyle",
    publishedAt: "Feb 28, 2026",
    coverImage: "https://plus.unsplash.com/premium_photo-1663056025073-a9c4344f8e75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxpZmVzdHlsZXxlbnwwfHwwfHx8MA%3D%3D",
    views: 11870,
  },
  {
    id: "startup-growth-strategies",
    title: "Startup Growth Strategies That Actually Work in 2026",
    excerpt:
      "Learn how modern startups scale sustainably using data-driven decision making.",
    category: "Business",
    publishedAt: "Feb 27, 2026",
    coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RhcnR1cHxlbnwwfHwwfHx8MA%3D%3D",
    views: 16240,
  },
  {
    id: "mental-health-digital-age",
    title: "Mental Health in the Digital Age: Finding Balance",
    excerpt:
      "How constant connectivity affects well-being and what you can do to stay mentally healthy.",
    category: "Health",
    publishedAt: "Feb 26, 2026",
    coverImage: "https://media.istockphoto.com/id/2036497686/photo/science-teamwork-and-scientist-with-tablet-in-laboratory-for-communication-pharmaceutical.webp?a=1&b=1&s=612x612&w=0&k=20&c=8-T6YOPGhKpDWmYW36Mgt0Z9PKdU8UkxTC2l1-pRGTU=",
    views: 13760,
  },
];

export default function TrendingPage() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % trendingBlogs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const ordered = useMemo(
        () => trendingBlogs.map((_, i) => trendingBlogs[(index + i) % trendingBlogs.length]),
        [index]
    );

    const activeBlog = ordered[0];

    return (
        <section className="w-full flex flex-col lg:flex-row bg-white border border-gray-200 shadow-lg shadow-blue-100 overflow-hidden">

            {/* HERO IMAGE — shows first on mobile */}
            <div className="order-1 lg:order-1 lg:w-1/2 w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-screen relative">
                <Image
                    src={"https://images.unsplash.com/photo-1501786223405-6d024d7c3b8d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt="Trending hero"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/45" />

                <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 text-white">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-white/80 mb-2">
                        {activeBlog.category}
                    </p>

                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2">
                        {activeBlog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/85 mt-1">
                        {activeBlog.views.toLocaleString()} views this week
                    </p>
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="order-2 lg:w-1/2 w-full flex flex-col p-5 sm:p-6 md:p-8 lg:p-12 bg-linear-to-b from-gray-50 to-white">

                {/* HEADER */}
                <div className="mb-6 sm:mb-8">
                    <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs font-semibold text-red-600 mb-2">
                        What's Hot
                    </p>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
                        Trending This Week
                    </h2>

                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
                        Stay ahead with the hottest articles the community is talking about.
                    </p>
                </div>

                {/* LIST — Only 3 cards visible, scrollable, hidden scrollbar */}
                <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-1 sm:pr-2 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                    <style>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {ordered.slice(0, 3).map((blog, i) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${blog.id}`}
                            className={`group block rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all duration-300
              ${i === 0
                                    ? "border-red-500 bg-red-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-red-300 hover:shadow"
                                }`}
                        >
                            <div className="flex gap-3 sm:gap-4">
                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition"
                                    />
                                </div>

                                <div className="flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {i === 0 && <FaFire className="text-red-600 text-[10px]" />}
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 0
                                                    ? "bg-red-600 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                #{i + 1}
                                            </span>

                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                {blog.category}
                                            </span>
                                        </div>

                                        <h4 className="font-semibold text-xs sm:text-sm md:text-base leading-snug line-clamp-2 group-hover:text-red-600">
                                            {blog.title}
                                        </h4>

                                        <p className="text-[10px] sm:text-xs text-gray-600 mt-1 line-clamp-1">
                                            {blog.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex justify-between text-[10px] sm:text-xs mt-2 text-gray-500">
                                        <span>{blog.publishedAt}</span>
                                        <span className="font-semibold">
                                            {blog.views.toLocaleString()} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* EXPLORE ALL BUTTON */}
                <Link
                    href="/blog?sort=trending"
                    className="mt-6 sm:mt-8 relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white overflow-hidden group rounded-xl sm:rounded-2xl"
                >
                    <span className="absolute inset-0 bg-linear-to-r from-red-600 to-red-500 transition-all duration-300 group-hover:from-red-700 group-hover:to-red-600" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20" />
                    <span className="relative flex items-center gap-2">
                        Explore All Trending
                        <FaArrowRight className="text-xs" />
                    </span>
                </Link>
            </div>
        </section>
    );
}