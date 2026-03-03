"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCheckCircle } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".nl-item", {
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
    });
  }, { scope: container });

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section
      ref={container}
      className="w-full bg-white py-20 sm:py-28 border-t border-gray-100"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">

        <h2 className="nl-item text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Join Our Newsletter
        </h2>

        <p className="nl-item text-gray-600 text-base sm:text-lg mb-10">
          Get curated insights on design, development, and AI — delivered once a week.
        </p>

        {!subscribed ? (
          <div className="nl-item flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900"
            />

            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition"
            >
              Subscribe
            </button>
          </div>
        ) : (
          <div className="nl-item flex flex-col items-center gap-2">
            <FaCheckCircle className="text-3xl text-green-500" />
            <p className="text-lg font-semibold text-gray-900">
              You're subscribed!
            </p>
            <p className="text-gray-500 text-sm">
              Please check your inbox.
            </p>
          </div>
        )}

        <p className="nl-item text-xs text-gray-400 mt-8 uppercase tracking-wider">
          No spam. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
}