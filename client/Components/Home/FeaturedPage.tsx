"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FeaturedBlog = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage: string;
};

const blogs: FeaturedBlog[] = [
  {
    id: "future-of-ai-creativity",
    title: "The Future of AI in Creative Industries",
    excerpt: "Explore how AI tools are transforming writing, design, and filmmaking while redefining creativity.",
    category: "Technology",
    publishedAt: "Mar 6, 2026",
    coverImage: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&auto=format&fit=crop",
  },
  {
    id: "global-street-food-journey",
    title: "A Global Journey Through Street Food Cultures",
    excerpt: "From Bangkok markets to Mexico City stalls, discover how street food reflects local identity.",
    category: "Food",
    publishedAt: "Mar 4, 2026",
    coverImage: "https://media.istockphoto.com/id/2176660544/photo/young-friends-talking-and-eating-taco-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z8sF62aev-MyTX8gTmnjWr3ZjEu9UwYOEei50034zro=",
  },
  {
    id: "designing-for-human-experience",
    title: "Designing Digital Products for Human Experience",
    excerpt: "Why empathy-driven design is becoming the key to building meaningful digital products.",
    category: "Design",
    publishedAt: "Mar 2, 2026",
    coverImage: "https://images.unsplash.com/photo-1678164384735-819fdc7cdb97?w=600&auto=format&fit=crop",
  },
  {
    id: "modern-brand-storytelling",
    title: "Modern Brand Storytelling That Builds Trust",
    excerpt: "Learn how brands use authentic storytelling to connect with audiences in a noisy digital world.",
    category: "Business",
    publishedAt: "Feb 28, 2026",
    coverImage: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=600&auto=format&fit=crop",
  },
];

export default function FeaturedAdvanced() {
  const [index, setIndex] = useState(0);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        end: "bottom 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(".featured-bg",
      { scale: 1.2, rotationZ: 2, opacity: 0 },
      { scale: 1, rotationZ: 0, opacity: 1, duration: 1.8, ease: "power3.out" }
    )
      .fromTo(".featured-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=1.4"
      )
      .fromTo(".featured-text",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=1"
      )
      .fromTo(".featured-cards",
        { y: 80, rotationX: 10, opacity: 0 },
        { y: 0, rotationX: 0, opacity: 1, duration: 1.2, ease: "back.out(1.5)" },
        "-=0.8"
      );
  }, { scope: container });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ordered = useMemo(
    () => blogs.map((_, i) => blogs[(index + i) % blogs.length]),
    [index]
  );

  return (
    <section ref={container} className="relative w-full bg-[#0B0F19] overflow-hidden">

      {/* GLOBAL BACKGROUND - Split Screen */}
      <div className="flex flex-col lg:flex-row w-full h-[80vh] min-h-[600px] lg:h-screen">

        {/* LEFT TEXT PANEL */}
        <div className="featured-panel lg:w-1/2 w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20 order-2 lg:order-1 relative z-10 border-r border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
          <div className="w-full max-w-lg mb-10">
            <p className="featured-text text-xs uppercase tracking-[0.25em] font-bold text-cyan-400 mb-4 inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Editorial Spotlight
            </p>

            <h2 className="featured-text text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Handpicked stories you shouldn’t miss
            </h2>

            <p className="featured-text text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
              Explore curated articles selected for their unique insights, striking creativity, and immense impact on the digital landscape.
            </p>

            <Link href="/blog" className="featured-text group inline-flex items-center gap-2 text-white font-medium hover:text-cyan-400 transition">
              Read the Editorial <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* STACKED 3D CARDS */}
          <div className="featured-cards relative w-full h-80 sm:h-96 w-full max-w-lg perspective-[1000px]">
            {ordered.slice(0, 3).map((blog, i) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className={`absolute inset-0 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${i === 0
                    ? "z-30 scale-100 translate-y-0 rotate-0 opacity-100 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                    : i === 1
                      ? "z-20 scale-[0.92] translate-y-6 opacity-70 blur-[1px]"
                      : "z-10 scale-[0.84] translate-y-12 opacity-40 blur-[2px]"
                  }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent" />

                  <div className="absolute bottom-0 p-6 text-white w-full">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cyan-400 font-semibold drop-shadow-md">
                      {blog.category} • {blog.publishedAt}
                    </span>

                    <h3 className="text-lg sm:text-xl font-bold mt-2 leading-snug drop-shadow-lg">
                      {blog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-300 mt-2 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE SHOWCASE */}
        <div className="lg:w-1/2 w-full h-[50vh] sm:h-[60vh] lg:h-full relative order-1 lg:order-2 overflow-hidden">
          <div className="featured-bg absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?q=80&w=687&auto=format&fit=crop"
              alt="Featured showcase"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0B0F19]/90 lg:to-[#0B0F19]" />
        </div>

      </div>
    </section>
  );
}