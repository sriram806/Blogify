"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaQuoteLeft } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: "Alex Rivera",
        role: "Tech Lead at OpenAI",
        quote: "Blogify's performance and developer experience are unmatched. The edge caching makes our articles load instantly anywhere in the world.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80"
    },
    {
        name: "Samantha Lee",
        role: "Indie Creator",
        quote: "I moved my entire newsletter and blog over. The advanced editor and beautiful UI keep my audience engaged longer than ever before.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80"
    },
    {
        name: "Michael Chen",
        role: "UX Engineer",
        quote: "The attention to detail in the interface, specifically the subtle animations and typography, makes writing feel like a premium experience.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80"
    },
    {
        name: "Emily Watson",
        role: "Editor-in-Chief",
        quote: "Managing a team of remote writers has never been easier. The analytics dashboard is powerful and beautifully designed.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80"
    },
    {
        name: "David Kim",
        role: "Fullstack Developer",
        quote: "Integrating Blogify into our existing architecture took less than a day. The API is lightning fast and robust.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80"
    }
];

export default function Testimonials() {
    const container = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Antigravity Header
        gsap.from(".test-ag-word", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)"
        });

        // 2. Infinite Marquee Animation
        if (marqueeRef.current) {
            const marqueeWidth = marqueeRef.current.scrollWidth / 2;

            gsap.to(marqueeRef.current, {
                x: -marqueeWidth,
                duration: 25,
                ease: "none",
                repeat: -1,
            });
        }

    }, { scope: container });

    return (
        <section ref={container} className="relative w-full bg-linear-to-b from-gray-50 to-white py-20 sm:py-28 overflow-hidden">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 mb-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 overflow-hidden flex flex-wrap justify-center gap-2 pb-2">
                    {"Loved By Creators Worldwide".split(" ").map((word, i) => (
                        <span key={i} className="test-ag-word inline-block">{word}</span>
                    ))}
                </h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                    Don't just take our word for it. See what top writers, developers, and brands are saying about Blogify.
                </p>
            </div>

            {/* MARQUEE CONTAINER */}
            <div className="relative w-full flex overflow-hidden group">

                {/* Left/Right Fades for smooth edge transition */}
                <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* MARQUEE TRACK (Duplicated Array for infinite loop effect) */}
                <div
                    ref={marqueeRef}
                    className="flex gap-6 sm:gap-8 px-4 w-max hover:[animation-play-state:paused]"
                >
                    {[...testimonials, ...testimonials].map((test, index) => (
                        <div
                            key={index}
                            className="w-80 sm:w-96 p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition duration-500 shrink-0 flex flex-col justify-between cursor-pointer"
                        >
                            <FaQuoteLeft className="text-3xl text-gray-200 mb-6" />

                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 flex-1">
                                "{test.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <Image
                                    src={test.image}
                                    alt={test.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
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
