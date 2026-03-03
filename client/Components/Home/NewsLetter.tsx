"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
        end: "bottom 90%",
        toggleActions: "play none none reverse",
      }
    });

    tl.from(".newsletter-card", {
      scale: 0.9,
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
      .from(".newsletter-bg", {
        scale: 0.5,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      }, "-=0.8")
      .from(".newsletter-content", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=1");
  }, { scope: container });

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section ref={container} className="relative container mx-auto px-4 py-4 md:py-28">

      {/* BACKGROUND GLOW */}
      <div className="newsletter-bg absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-105 h-105 bg-linear-to-r from-purple-500/20 to-blue-500/20 blur-3xl rounded-md" />
      </div>

      {/* CARD */}
      <div className="newsletter-card relative p-8 md:p-14 rounded-md bg-linear-to-r from-black via-gray-900 to-gray-800 text-white text-center shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden">

        {/* SUBTLE PATTERN */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_60%)]" />

        <div className="relative z-10">
          <h2 className="newsletter-content text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Never Miss an Article
          </h2>

          <p className="newsletter-content text-gray-300 mb-8 max-w-2xl mx-auto text-base md:text-lg">
            Join thousands of readers and get the latest insights, tutorials,
            and curated stories delivered straight to your inbox.
          </p>

          {!subscribed ? (
            <div className="newsletter-content flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl bg-white/90 text-black outline-none focus:ring-2 focus:ring-white"
              />

              <button
                onClick={handleSubmit}
                className="px-7 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                Subscribe
              </button>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 inline-block">
              🎉 You’re subscribed! Check your inbox.
            </div>
          )}

          <p className="newsletter-content text-gray-400 text-sm mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}