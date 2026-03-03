"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState, useRef } from "react";
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
    excerpt:
      "Explore how AI tools are transforming writing, design, and filmmaking while redefining creativity.",
    category: "Technology",
    publishedAt: "Mar 6, 2026",
    coverImage: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "global-street-food-journey",
    title: "A Global Journey Through Street Food Cultures",
    excerpt:
      "From Bangkok markets to Mexico City stalls, discover how street food reflects local identity.",
    category: "Food",
    publishedAt: "Mar 4, 2026",
    coverImage: "https://media.istockphoto.com/id/2176660544/photo/young-friends-talking-and-eating-taco-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z8sF62aev-MyTX8gTmnjWr3ZjEu9UwYOEei50034zro=",
  },
  {
    id: "designing-for-human-experience",
    title: "Designing Digital Products for Human Experience",
    excerpt:
      "Why empathy-driven design is becoming the key to building meaningful digital products.",
    category: "Design",
    publishedAt: "Mar 2, 2026",
    coverImage: "https://images.unsplash.com/photo-1678164384735-819fdc7cdb97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aHVtYW4lMjBleHBlcmllbmNlfGVufDB8fDB8fHww",
  },
  {
    id: "modern-brand-storytelling",
    title: "Modern Brand Storytelling That Builds Trust",
    excerpt:
      "Learn how brands use authentic storytelling to connect with audiences in a noisy digital world.",
    category: "Business",
    publishedAt: "Feb 28, 2026",
    coverImage: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0b3J5JTIwdGVsbGluZ3xlbnwwfHwwfHx8MA%3D%3D",
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

    tl.from(".featured-image", {
      scale: 1.1,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    })
      .from(".featured-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.8")
      .from(".featured-text", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6")
      .from(".featured-cards", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)"
      }, "-=0.4");
  }, { scope: container });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blogs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ordered = useMemo(
    () => blogs.map((_, i) => blogs[(index + i) % blogs.length]),
    [index]
  );

  return (
    <section ref={container} className="w-full flex flex-col lg:flex-row overflow-hidden">

      {/* RIGHT IMAGE FIRST ON MOBILE */}
      <div className="featured-image lg:w-1/2 w-full h-[55vh] sm:h-[60vh] lg:h-screen relative order-1 lg:order-2">
        <Image
          src="https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Featured hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/40 to-black/30" />

        <div className="featured-content relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 text-white max-w-xl">
          <p className="uppercase tracking-[0.25em] text-xs font-semibold text-white/70 mb-4">
            Editorial Spotlight
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Discover ideas that shape the future of tech & creativity
          </h2>

          <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
            Explore curated articles from developers, designers, and founders.
            Featured stories rotate automatically to keep inspiration flowing.
          </p>
        </div>
      </div>

      {/* LEFT CONTENT */}
      <div className="lg:w-1/2 w-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-12 py-12 lg:py-0 order-2 lg:order-1">

        {/* TEXT */}
        <div className="w-full max-w-lg mb-8">
          <p className="featured-text text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-2">
            Featured
          </p>

          <h2 className="featured-text text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Handpicked stories you shouldn’t miss
          </h2>

          <p className="featured-text text-gray-600 text-sm sm:text-base mt-2">
            Explore curated articles selected for their insights, creativity, and impact.
          </p>
        </div>

        {/* STACKED CARDS */}
        <div className="featured-cards relative w-full max-w-md sm:max-w-lg h-80 sm:h-95 lg:h-105">

          {ordered.slice(0, 3).map((blog, i) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className={`absolute inset-0 rounded-3xl overflow-hidden shadow-xl transition-all duration-700
              ${i === 0
                  ? "z-30 scale-100 translate-y-0"
                  : i === 1
                    ? "z-20 scale-95 translate-y-5 opacity-80"
                    : "z-10 scale-90 translate-y-10 opacity-60"
                }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute bottom-0 p-4 sm:p-6 text-white">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
                    {blog.category} • {blog.publishedAt}
                  </span>

                  <h3 className="text-sm sm:text-lg font-bold mt-1 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}