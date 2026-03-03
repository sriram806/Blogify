"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { FaArrowRight, FaFire } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TrendingBlog = {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    coverImage: string;
    views: number;
    heightClass: string;
};

const trendingBlogs: TrendingBlog[] = [
    {
        id: "future-of-ai-products",
        title: "The Next Wave of AI Products Changing Everyday Life",
        excerpt: "From personal assistants to smart automation, explore how AI products are reshaping how we live and work.",
        category: "Technology",
        publishedAt: "Mar 5, 2026",
        coverImage: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1170&auto=format&fit=crop",
        views: 21450,
        heightClass: "h-80",
    },
    {
        id: "street-food-culture-india",
        title: "Street Food Culture: Why Local Flavors Define Cities",
        excerpt: "A journey through vibrant street food scenes and the stories behind the world’s most loved dishes.",
        category: "Food",
        publishedAt: "Mar 3, 2026",
        coverImage: "https://plus.unsplash.com/premium_photo-1695297515417-5aeacd5dd313?w=600&auto=format&fit=crop",
        views: 17820,
        heightClass: "h-64",
    },
    {
        id: "modern-digital-culture",
        title: "How Digital Communities Are Shaping Modern Culture",
        excerpt: "Online communities are redefining identity, creativity, and collaboration in the digital age.",
        category: "Culture",
        publishedAt: "Mar 2, 2026",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
        views: 14310,
        heightClass: "h-96",
    },
    {
        id: "remote-work-travel",
        title: "Remote Work & Travel: Building a Career Without Borders",
        excerpt: "Discover how professionals are blending work with travel and designing flexible lifestyles.",
        category: "Travel",
        publishedAt: "Mar 1, 2026",
        coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop",
        views: 12980,
        heightClass: "h-72",
    },
    {
        id: "minimalist-lifestyle",
        title: "Minimalist Living: Why Less Is Becoming More",
        excerpt: "A practical guide to simplifying your lifestyle and focusing on what truly matters.",
        category: "Lifestyle",
        publishedAt: "Feb 28, 2026",
        coverImage: "https://plus.unsplash.com/premium_photo-1663056025073-a9c4344f8e75?w=600&auto=format&fit=crop",
        views: 11870,
        heightClass: "h-80",
    },
    {
        id: "startup-growth-strategies",
        title: "Startup Growth Strategies That Actually Work in 2026",
        excerpt: "Learn how modern startups scale sustainably using data-driven decision making.",
        category: "Business",
        publishedAt: "Feb 27, 2026",
        coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop",
        views: 16240,
        heightClass: "h-64",
    },
];

export default function TrendingPage() {
    const container = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            }
        });

        // Header Entrance
        tl.fromTo(".trend-head",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
        );

        // Masonry Cards Cinematic Pop-in
        tl.fromTo(".trend-card",
            { y: 100, z: -100, rotationX: 10, opacity: 0 },
            {
                y: 0, z: 0, rotationX: 0, opacity: 1, duration: 1.2,
                stagger: { amount: 0.8, from: "random" },
                ease: "back.out(1.5)"
            },
            "-=0.6"
        );

    }, { scope: container });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <section ref={container} className="relative w-full bg-[#0B0F19] py-24 sm:py-32 overflow-hidden border-t border-white/5">

            {/* Background Cinematic Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="trend-head inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-widest uppercase mb-4">
                            <FaFire className="animate-pulse" /> Trending Now
                        </div>
                        <h2 className="trend-head text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                            What the world is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">reading today.</span>
                        </h2>
                    </div>
                    <Link
                        href="/blog?sort=trending"
                        className="trend-head group relative inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition duration-300"
                    >
                        Explore All
                        <FaArrowRight className="group-hover:translate-x-1 transition" />
                    </Link>
                </div>

                {/* MASONRY GRID */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {trendingBlogs.map((blog, i) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${blog.id}`}
                            className={`trend-card group relative block w-full rounded-3xl overflow-hidden bg-[#121826] border border-white/5 break-inside-avoid ${blog.heightClass}`}
                            onMouseMove={handleMouseMove}
                        >
                            <div
                                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                                style={{
                                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`
                                }}
                            />

                            <Image
                                src={blog.coverImage}
                                alt={blog.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition duration-700 ease-out"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent p-6 sm:p-8 flex flex-col justify-end z-20">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-white/10 backdrop-blur-md rounded-md border border-white/10">
                                        {blog.category}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {blog.views.toLocaleString()} views
                                    </span>
                                </div>

                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug mb-2 group-hover:text-red-400 transition">
                                    {blog.title}
                                </h3>

                                <p className="text-sm text-gray-400 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                                    {blog.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}