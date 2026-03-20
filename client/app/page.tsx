"use client";

import { useEffect } from "react";
import FeaturedPage from "@/Components/Home/FeaturedPage";
import TrendingPage from "@/Components/Home/TrendingPage";
import PremiumFeatures from "@/Components/Home/PremiumFeatures";
import Testimonials from "@/Components/Home/Testimonials";
import NewsletterSection from "@/Components/Home/NewsLetter";
import { useAuth } from "@/Components/Auth/AuthProvider";
import Hero from "@/Components/Home/Hero";

export default function HomePage() {
  const { greeting, setGreeting } = useAuth();
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

      <Hero />
      <FeaturedPage />
      <TrendingPage />
      <PremiumFeatures />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}