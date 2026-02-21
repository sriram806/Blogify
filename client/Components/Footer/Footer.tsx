"use client";

import Image from "next/image";
import Link from "next/link";
import {  FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Blogs", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Featured", href: "/#featured" },
      { label: "Trending", href: "/#trending" },
      { label: "Guides", href: "/blog?tag=guides" },
      { label: "Community", href: "/blog?tag=community" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Travel", href: "/blog?category=travel" },
      { label: "Ocean", href: "/blog?category=ocean" },
      { label: "Mountains", href: "/blog?category=mountains" },
      { label: "Nature", href: "/blog?category=nature" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 sm:mt-20 overflow-hidden bg-linear-to-b from-black via-gray-950 to-black text-white">

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-70 sm:w-100 md:w-125 h-70 sm:h-100 md:h-125 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 right-0 w-60 sm:w-[320px] md:w-105 h-60 sm:h-80 md:h-105 bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16">

        {/* BRAND SECTION */}
        <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
          <Link href="/" className="inline-flex items-center gap-3 justify-center md:justify-start">
            <Image src="/logo.webp" alt="Blogify" width={140} height={42} />
          </Link>

          <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed">
            Blogify is a modern publishing platform where creators share ideas,
            insights, and stories with a global audience.
          </p>

          {/* Social */}
          <div className="mt-5 flex justify-center md:justify-start gap-4 text-lg">
            <Link href="#" className="text-white/60 hover:text-white transition">
              <FaXTwitter />
            </Link>
            <Link href="#" className="text-white/60 hover:text-white transition">
              <FaGithub />
            </Link>
            <Link href="#" className="text-white/60 hover:text-sky-500 transition">
              <FaLinkedin />
            </Link>
          </div>
        </div>

        {/* LINKS GRID UNDER BRAND */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {section.title}
              </h4>

              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/70 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 sm:mt-14 border-t border-white/10 pt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-[10px] sm:text-xs text-white/60 text-center md:text-left">
          <span>© 2026 Blogify. All rights reserved.</span>

          <div className="flex gap-5 justify-center md:justify-end">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}