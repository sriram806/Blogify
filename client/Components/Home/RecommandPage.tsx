"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

type RecommendedBlog = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    image: string;
  };
  readTime: string;
  isSaved?: boolean;
};

const recommendations: RecommendedBlog[] = [
  {
    id: "react-ai-interfaces",
    title: "Building AI-Powered React Interfaces with Vercel AI SDK",
    excerpt: "Learn how to seamlessly integrate streaming LLM responses into your React components for a next-gen user experience.",
    category: "React + AI",
    publishedAt: "Mar 7, 2026",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1170&auto=format&fit=crop",
    author: { name: "Sarah Drasner", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    readTime: "8 min read",
    isSaved: true,
  },
  {
    id: "nextjs-openai-streaming",
    title: "Next.js & OpenAI: Mastering Streaming Chat UIs in 2026",
    excerpt: "A deep dive into building ultra-fast chat interfaces utilizing React Server Components and edge runtimes.",
    category: "Next.js",
    publishedAt: "Mar 5, 2026",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1170&auto=format&fit=crop",
    author: { name: "Lee Robinson", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" },
    readTime: "6 min read",
    isSaved: false,
  },
  {
    id: "frontend-llm-integration",
    title: "The Future of Frontend: Integrating Local LLMs in Browser",
    excerpt: "Explore how WebGPU and WebAssembly are bringing powerful AI models directly to the client side without server costs.",
    category: "AI",
    publishedAt: "Mar 1, 2026",
    coverImage: "https://plus.unsplash.com/premium_photo-1683120966127-14162cdd0935?q=80&w=1170&auto=format&fit=crop",
    author: { name: "Guillermo Rauch", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    readTime: "10 min read",
    isSaved: false,
  }
];

export default function RecommandPage() {
  const container = useRef<HTMLDivElement>(null);
  const typeTarget = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    // 1. Scene Entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
      }
    });

    tl.from(".rec-bg-glow", {
      opacity: 0,
      scale: 0.8,
      duration: 2,
      ease: "power2.out"
    });

    gsap.fromTo(".rec-card",
      {
        y: 100,
        rotationY: 15,
        z: -50,
        opacity: 0,
      },
      {
        y: 0,
        rotationY: 0,
        z: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%", // Start earlier for better mobile visibility
          toggleActions: "play none none reverse",
        }
      }
    );

    // 2. Typing Effect (Simulating AI processing)
    if (typeTarget.current) {
      const typeTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        }
      });

      // Simulate analyzing dots
      typeTl.to(typeTarget.current, {
        text: { value: "Analyzing profile..." },
        duration: 0.8,
        ease: "none",
      })
        .to(typeTarget.current, {
          text: { value: "Matching content..." },
          duration: 0.8,
          delay: 0.2,
          ease: "none",
        })
        .to(typeTarget.current, {
          text: { value: "Recommended for you based on React + AI interests." },
          duration: 1.5,
          delay: 0.3,
          ease: "none",
        });
    }

    // 3. Scanner Line Effect on Cards
    gsap.utils.toArray<HTMLElement>(".rec-card").forEach((card) => {
      const scanner = card.querySelector(".ai-scanner");
      if (scanner) {
        // We use the card's height so the scanner line traverses the whole component
        gsap.fromTo(scanner,
          { y: 0 },
          {
            y: () => card.offsetHeight,
            duration: 2.5,
            ease: "none",
            repeat: -1,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            }
          }
        );
      }
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full bg-white py-24 sm:py-32 overflow-hidden border-t border-gray-100">

      {/* BACKGROUND GLOWS */}
      <div className="rec-bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[150px] rounded-[100%] pointer-events-none mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10">

        {/* AI HEADER */}
        <div className="mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-6 relative">
            {/* Pulsing AI Indicator */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-blue-400 opacity-30"></span>
              <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest uppercase text-blue-600 flex items-center gap-2">
                AI Match Engine
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
              </span>
              <span className="text-xs text-gray-500 font-medium">Confidence Score: 98.4%</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 h-[80px] md:h-[100px] flex items-start sm:items-center">
            <span ref={typeTarget} className="border-r-2 border-blue-500 pr-1 animate-pulse"></span>
          </h2>
        </div>

        {/* HORIZONTAL CAROUSEL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((blog, i) => (
            <div
              key={blog.id}
              className="rec-card group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-500 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] hover:-translate-y-2"
            >

              {/* AI Scanner Line */}
              <div className="ai-scanner absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 z-50 mix-blend-multiply shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-opacity duration-300 pointer-events-none" />

              {/* IMAGE HEADER */}
              <Link href={`/blog/${blog.id}`} className="relative h-56 w-full overflow-hidden block">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 mix-blend-multiply" />

                {/* SAVE BUTTON */}
                <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm">
                  {blog.isSaved ? <FaBookmark className="text-blue-600" /> : <FaRegBookmark />}
                </button>
              </Link>

              {/* CONTENT */}
              <div className="flex flex-col flex-1 p-6 sm:p-8 -mt-6 z-10 bg-white relative rounded-t-[2rem]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{blog.readTime}</span>
                </div>

                <Link href={`/blog/${blog.id}`} className="block mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-8 flex-1">
                  {blog.excerpt}
                </p>

                {/* AUTHOR FOOTER */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 rounded-full group-hover:ring-2 ring-blue-500/30 transition">
                      <Image
                        src={blog.author.image}
                        alt={blog.author.name}
                        width={40} height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{blog.author.name}</h4>
                      <p className="text-xs text-gray-500">{blog.publishedAt}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}