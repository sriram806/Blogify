"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
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
  );
}