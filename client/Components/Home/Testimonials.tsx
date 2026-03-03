"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: "Alex Rivera",
        role: "Tech Lead at OpenAI",
        quote: "Blogify's performance and developer experience are unmatched. The edge caching makes our articles load instantly anywhere.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150"
    },
    {
        name: "Samantha Lee",
        role: "Indie Creator",
        quote: "I moved my entire newsletter and blog over. The advanced editor and beautiful UI keep my audience engaged longer than ever before.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
        name: "Michael Chen",
        role: "UX Engineer",
        quote: "The attention to detail in the interface, specifically the subtle animations and typography, makes writing feel like a premium experience.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
        name: "Emily Watson",
        role: "Editor-in-Chief",
        quote: "Managing a team of remote writers has never been easier. The analytics dashboard is powerful and beautifully designed.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    {
        name: "David Kim",
        role: "Fullstack Developer",
        quote: "Integrating Blogify into our existing architecture took less than a day. The API is lightning fast and robust.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
];

export default function Testimonials() {
    const container = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        // 1. Antigravity Header
        gsap.from(".test-ag-word", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out"
        });

        // 2. Infinite Marquee Animation
        if (marqueeRef.current) {
            const marqueeWidth = marqueeRef.current.scrollWidth / 2;

            gsap.to(marqueeRef.current, {
                x: -marqueeWidth,
                duration: 35,
                ease: "none",
                repeat: -1,
            });
        }

        // 3. Particle Float
        gsap.to(".test-particle", {
            y: "random(-50, 50)",
            x: "random(-50, 50)",
            rotation: "random(-45, 45)",
            opacity: "random(0.2, 0.6)",
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: 0.2
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative w-full bg-slate-50 py-24 sm:py-32 overflow-hidden border-t border-gray-100">

            {/* FLOATING PARTICLES (Cinematic Background) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {mounted && [...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`test-particle absolute rounded-full mix-blend-multiply blur-[80px] ${i % 2 === 0 ? 'bg-purple-300/40 w-80 h-80' : 'bg-blue-300/40 w-64 h-64'
                            }`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            {/* HEADER */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 mb-20 text-center">
                <p className="test-ag-word uppercase tracking-[0.25em] text-xs font-bold text-gray-500 mb-4 inline-block">
                    Trusted globally
                </p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 overflow-hidden flex flex-wrap justify-center gap-x-3 gap-y-2 pb-2">
                    {"Loved By Creators Worldwide".split(" ").map((word, i) => (
                        <span key={i} className="test-ag-word inline-block">{word}</span>
                    ))}
                </h2>
                <p className="test-ag-word mt-6 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
                    Don't just take our word for it. See what top writers, developers, and brands are building with Blogify.
                </p>
            </div>

            {/* MARQUEE CONTAINER */}
            <div className="relative z-10 w-full flex overflow-hidden group">

                {/* Cinematic Edge Fades */}
                <div className="absolute top-0 left-0 w-32 sm:w-64 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                {/* MARQUEE TRACK */}
                <div
                    ref={marqueeRef}
                    className="flex gap-6 sm:gap-8 px-4 w-max hover:[animation-play-state:paused]"
                >
                    {[...testimonials, ...testimonials].map((test, index) => (
                        <div
                            key={index}
                            className="w-80 sm:w-96 p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 shrink-0 flex flex-col justify-between cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <FaQuoteLeft className="text-3xl text-blue-200" />
                                <div className="flex gap-1 text-yellow-400 text-sm">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 flex-1">
                                "{test.quote}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                <Image
                                    src={test.image}
                                    alt={test.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover ring-2 ring-gray-100"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{test.name}</h4>
                                    <p className="text-xs text-gray-500">{test.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
}
