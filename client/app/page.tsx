"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import FeaturedPage from "@/Components/Home/FeaturedPage";
import TrendingPage from "@/Components/Home/TrendingPage";
import PremiumFeatures from "@/Components/Home/PremiumFeatures";
import Testimonials from "@/Components/Home/Testimonials";
import RecommandPage from "@/Components/Home/RecommandPage";
import NewsletterSection from "@/Components/Home/NewsLetter";
import { useAuth } from "@/Components/Auth/AuthProvider";
import gsap from "gsap";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

export default function HomePage() {
  const { greeting, setGreeting } = useAuth();
  const container = useRef<HTMLDivElement>(null);

  // 1. Cinematic Entrance Hook
  useHeroAnimation(container)

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
      <section
        ref={container}
        className="relative min-h-screen w-full overflow-hidden bg-gray-50"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-0" />
        <div className="absolute top-0 -left-40 sm:-left-64 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-purple-500/10 blur-[120px] rounded-full z-0" />
        <div className="absolute bottom-0 right-0 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-blue-500/10 blur-[150px] rounded-full z-0" />

        {/* Full Width Grid */}
        <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">

          {/* LEFT CONTENT */}
          <div className="flex items-center px-6 sm:px-10 lg:px-20 py-16 lg:py-0">
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-gray-700 mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Introducing Blogify Premium Edition
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
                Grow through stories and ideas
              </h1>

              {/* Description */}
              <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
                Discover curated articles on technology, design, productivity,
                and personal growth. Learn from real experiences and practical insights.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:-translate-y-1 transition"
                >
                  Start Reading
                  <FaArrowRight />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm sm:text-base font-medium transition"
                >
                  How it works
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap gap-8 text-xs sm:text-sm text-gray-500">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">500+</p>
                  Articles
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">120k</p>
                  Readers
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">50+</p>
                  Writers
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT IMAGE FULL EDGE */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-auto">

            {/* Full Bleed Image */}
            <Image
              src="/images/hero-blog.png"
              alt="Blog Hero"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

            {/* Floating Card 1 */}
            <div className="absolute top-8 left-6 sm:left-10 md:left-14 lg:left-20 z-20">
              <div className="bg-white/90 backdrop-blur-xl border border-gray-100 p-4 sm:p-5 rounded-2xl max-w-[180px] sm:max-w-[220px] shadow-lg">
                <p className="text-xs text-gray-500 uppercase mb-1">Featured Post</p>
                <p className="text-xs text-gray-900">
                  Building the future with React and Generative AI.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <FeaturedPage />
      <TrendingPage />
      <PremiumFeatures />
      <Testimonials />
      <RecommandPage />
      <NewsletterSection />
    </>
  );
}