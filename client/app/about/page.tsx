"use client";

import Image from "next/image";
import { FaPenNib, FaUsers, FaGlobe, FaRocket } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="w-full bg-linear-to-b from-white via-gray-50 to-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-14 sm:py-16 md:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          About <span className="text-black">Blogify</span>
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Blogify is a modern publishing platform designed for creators,
          developers, writers, and curious minds to share ideas, insights,
          and stories with the world.
        </p>
      </section>

      {/* ABOUT INTRO */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative w-full h-80 sm:h-100 md:h-120  overflow-hidden">
            <Image
              src="/images/about-banner.png"
              alt="About Blogify"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Our Story
            </h2>

            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Blogify started with a simple vision — to create a space where
              knowledge flows freely. We believe that everyone has a story to
              tell, and ideas can inspire change when shared.
            </p>

            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              Today, Blogify is home to creators from around the world sharing
              experiences, tutorials, opinions, and insights across technology,
              lifestyle, culture, travel, and more.
            </p>
          </div>

        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-14 grid md:grid-cols-2 gap-10">

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Our Mission
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              To empower creators with tools and a platform that make publishing
              simple, accessible, and impactful.
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Our Vision
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              To become a global hub for authentic stories, knowledge sharing,
              and meaningful digital conversations.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
          What Makes Blogify Different
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <Feature icon={<FaPenNib />} title="Easy Publishing" text="Write and publish stories effortlessly with a clean editor." />
          <Feature icon={<FaUsers />} title="Community Driven" text="Connect with readers and creators worldwide." />
          <Feature icon={<FaGlobe />} title="Global Reach" text="Share your voice with a global audience." />
          <Feature icon={<FaRocket />} title="Fast & Modern" text="Built with modern tech for speed and reliability." />

        </div>

        {/* ADDITIONAL FEATURES */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Feature 
            icon={<FaPenNib />} 
            title="Rich Media Support" 
            text="Embed videos, images, and interactive content seamlessly into your stories." 
          />
          <Feature 
            icon={<FaUsers />} 
            title="Analytics Dashboard" 
            text="Track article performance, reader engagement, and growth metrics in real-time." 
          />
          <Feature 
            icon={<FaGlobe />} 
            title="SEO Optimized" 
            text="Automatic SEO optimization ensures your content ranks higher in search results." 
          />
          <Feature 
            icon={<FaRocket />} 
            title="Social Sharing" 
            text="One-click sharing to Twitter, LinkedIn, Facebook, and other social platforms." 
          />
          <Feature 
            icon={<FaPenNib />} 
            title="Customizable Profiles" 
            text="Create a beautiful author profile with your bio, links, and social handles." 
          />
          <Feature 
            icon={<FaUsers />} 
            title="Newsletter Integration" 
            text="Build and manage your subscriber list directly from Blogify." 
          />

        </div>
      </section>

      {/* STATS */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <Stat number="500+" label="Articles Published" />
          <Stat number="120k" label="Monthly Readers" />
          <Stat number="50+" label="Writers" />
          <Stat number="30+" label="Countries" />
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
          Meet the Team
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8">

          <TeamCard name="Sriram" role="Founder & Developer" />
          <TeamCard name="Aisha Patel" role="Content Strategist" />
          <TeamCard name="Daniel Kim" role="UI/UX Designer" />

        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16 px-5">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Want to share your story?
        </h3>

        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Join Blogify today and start publishing your ideas.
        </p>

        <button className="mt-6 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
          Start Writing
        </button>
      </section>

    </main>
  );
}

/* ---------- Components ---------- */

function Feature({ icon, title, text }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="text-black text-xl">{icon}</div>
      <h4 className="mt-3 font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </div>
  );
}

function Stat({ number, label }: any) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-bold">{number}</p>
      <p className="text-xs sm:text-sm text-white/70 mt-1">{label}</p>
    </div>
  );
}

function TeamCard({ name, role }: any) {
  return (
    <div className="text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4" />
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  );
}