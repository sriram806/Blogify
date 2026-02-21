"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

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

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-70 sm:w-100 md:w-125 h-70 sm:h-100 md:h-125 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 right-0 w-60 sm:w-[320px] md:w-105 h-60 sm:h-80 md:h-105 bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16">

        {/* CTA */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="text-center md:text-left">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60">
              Join the community
            </p>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
              Publish your ideas with Blogify
            </h3>

            <p className="text-white/70 mt-2 text-xs sm:text-sm max-w-md mx-auto md:mx-0">
              Share knowledge, build your audience, and connect with creators worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/blog"
              className="text-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-black text-sm sm:text-base font-semibold hover:bg-gray-200 transition"
            >
              Explore
            </Link>

            <Link
              href="/about"
              className="text-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/30 text-sm sm:text-base hover:bg-white/10 transition"
            >
              Become a writer
            </Link>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-12 sm:mt-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.webp" alt="Blogify" width={130} height={40} />
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              Blogify is a modern publishing platform where creators share
              ideas, insights, and stories with a global audience.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-4 text-lg">
              <Link href="#" className="text-white/60 hover:text-white transition">
                <FaTwitter />
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition">
                <FaGithub />
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition">
                <FaLinkedin />
              </Link>
            </div>
          </div>

          {/* Links */}
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

        {/* Bottom */}
        <div className="mt-12 sm:mt-14 border-t border-white/10 pt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-[10px] sm:text-xs text-white/60">
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