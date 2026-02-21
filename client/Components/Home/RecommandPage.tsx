"use client";

import Image from "next/image";
import Link from "next/link";

const recommendations = [
  {
    id: "coastal-escape-guide",
    title: "The Ultimate Guide to Coastal Escapes in 2026",
    excerpt:
      "Discover serene beaches, hidden coves, and the best coastal destinations for a peaceful getaway.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VHJhdmVsfGVufDB8fDB8fHww",
  },
  {
    id: "life-by-the-ocean",
    title: "Why Life by the Ocean Feels So Refreshing",
    excerpt:
      "Explore how ocean landscapes influence well-being, creativity, and a slower pace of life.",
    category: "Ocean",
    image: "https://plus.unsplash.com/premium_photo-1666286163385-abe05f0326c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8T0NFQU58ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "mountain-adventure-trails",
    title: "Top Mountain Trails for Your Next Adventure",
    excerpt:
      "From beginner hikes to breathtaking summit routes, find the perfect mountain journey.",
    category: "Mountains",
    image: "https://images.unsplash.com/photo-1627855787845-ece96f1747b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fE1PVU5BVElOU3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

export default function RecommandPage() {
  const featured = recommendations[0];
  const side = recommendations.slice(1);

  return (
    <section className="w-full bg-linear-to-br from-gray-300 via-gray-100 to-gray-300 py-12 sm:py-14 md:py-16">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 mb-8 sm:mb-10 md:mb-12">
        <p className="uppercase tracking-[0.25em] text-[10px] sm:text-xs font-semibold text-gray-500 mb-3">
          Recommended For You
        </p>

        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl leading-tight">
          Curated stories to inspire your next big idea
        </h1>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 grid gap-6 sm:gap-8 md:gap-8 lg:grid-cols-3">

        {/* FEATURED CARD */}
        <Link
          href={`/blog/${featured.id}`}
          className="lg:col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group"
        >
          <div className="relative w-full aspect-video sm:aspect-video md:aspect-16/8">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-700"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />

            <div className="absolute bottom-0 p-5 sm:p-6 md:p-8 text-white max-w-lg">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
                {featured.category}
              </span>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2 leading-snug">
                {featured.title}
              </h2>

              <p className="text-white/80 mt-2 text-xs sm:text-sm md:text-base">
                {featured.excerpt}
              </p>
            </div>
          </div>
        </Link>

        {/* SIDE CARDS */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {side.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.id}`}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group"
            >
              <div className="relative w-full aspect-video sm:aspect-16/8">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

                <div className="absolute bottom-0 p-4 sm:p-5 text-white">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
                    {item.category}
                  </span>

                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-1 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="text-center mt-10 sm:mt-12 md:mt-14 px-5">
        <button className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-black text-white text-sm sm:text-base font-semibold hover:bg-gray-800 transition">
          Browse all recommendations →
        </button>
      </div>

    </section>
  );
}