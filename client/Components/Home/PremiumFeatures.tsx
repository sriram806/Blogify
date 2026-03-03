"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaPenFancy, FaChartLine, FaRobot, FaPalette } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: FaPenFancy,
        title: "Distraction-Free Writing",
        desc: "A beautifully minimal editor that lets you focus entirely on your words and ideas.",
        color: "text-purple-400",
        bg: "bg-purple-900/20",
        glow: "bg-purple-500/10",
    },
    {
        icon: FaPalette,
        title: "Premium Aesthetics",
        desc: "Your content deserves a beautiful canvas. Customize layouts with tech-level polish.",
        color: "text-cyan-400",
        bg: "bg-cyan-900/20",
        glow: "bg-cyan-500/10",
    },
    {
        icon: FaChartLine,
        title: "Deep Analytics",
        desc: "Understand your audience with real-time, privacy-first data and visual insights.",
        color: "text-green-400",
        bg: "bg-green-900/20",
        glow: "bg-green-500/10",
    },
    {
        icon: FaRobot,
        title: "AI Co-Pilot",
        desc: "Enhance your workflow with smart generation, grammar checks, and title ideation.",
        color: "text-rose-400",
        bg: "bg-rose-900/20",
        glow: "bg-rose-500/10",
    },
];

export default function PremiumFeatures() {
    const container = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Antigravity Header Entrance
        gsap.from(".pf-ag-word", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 80,
            opacity: 0,
            rotationX: -90,
            duration: 1.2,
            stagger: 0.05,
            ease: "power3.out"
        });

        // 2. Horizontal Scroll Setup
        if (!trackRef.current) return;

        // Calculate total movement correctly based on desktop vs mobile
        // Using xPercent: -100 * (features.length - 1) makes it pin and slide left perfectly
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                pin: true,
                scrub: 1, // Smooth scrubbing
                start: "top top",
                end: () => `+=${trackRef.current?.offsetWidth || 2000}`,
            }
        });

        tl.to(trackRef.current, {
            xPercent: -100 * (features.length - 1) / features.length,
            ease: "none",
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative w-full h-screen overflow-hidden border-t border-gray-100 flex flex-col justify-center bg-gray-50">

            {/* Subtle Animated Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-500/5 blur-[120px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full mix-blend-multiply" />
            </div>


            <div className="absolute top-12 sm:top-20 left-0 w-full px-5 sm:px-10 z-20 text-center pointer-events-none flex flex-col items-center">

                {/* Decorative SVG Flourish */}
                <div className="mb-6 opacity-70 pf-ag-word">
                    <svg
                        width="220"
                        height="45"
                        viewBox="0 0 200 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400 drop-shadow-sm"
                    >
                        {/* Left Wing */}
                        <path d="M85 30 Q70 28 60 20 Q75 30 85 30 Z" fill="currentColor" />
                        <path d="M90 32 Q70 30 50 25 Q75 35 90 32 Z" fill="currentColor" />
                        <path d="M95 34 Q70 34 40 32 Q75 38 95 34 Z" fill="currentColor" />
                        <circle cx="98" cy="33" r="2" fill="currentColor" />

                        {/* Right Wing */}
                        <path d="M115 30 Q130 28 140 20 Q125 30 115 30 Z" fill="currentColor" />
                        <path d="M110 32 Q130 30 150 25 Q125 35 110 32 Z" fill="currentColor" />
                        <path d="M105 34 Q130 34 160 32 Q125 38 105 34 Z" fill="currentColor" />
                        <circle cx="102" cy="33" r="2" fill="currentColor" />

                        {/* Center Arc */}
                        <path
                            d="M90 20 A 10 10 0 0 1 110 20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                        />

                        {/* Horizontal Lines */}
                        <line
                            x1="10"
                            y1="38"
                            x2="85"
                            y2="38"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity="0.5"
                        />
                        <line
                            x1="115"
                            y1="38"
                            x2="190"
                            y2="38"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity="0.5"
                        />
                    </svg>
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0F172A] overflow-hidden flex flex-wrap justify-center gap-2 sm:gap-3 pb-2 perspective-[1000px]">
                    {"Unleash your creative potential".split(" ").map((word, i) => (
                        <span key={i} className="pf-ag-word inline-block origin-bottom">
                            {word}
                        </span>
                    ))}
                </h2>

            </div>

            <div className="w-full flex items-center h-full pt-20">
                <div
                    ref={trackRef}
                    className="flex h-full min-h-[400px]"
                    style={{ width: `${features.length * 100}vw` }}
                >
                    {features.map((feat, index) => (
                        <div
                            key={index}
                            className="w-screen h-full flex flex-col items-center justify-center px-10 relative"
                        >
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full blur-[120px] mix-blend-multiply pointer-events-none -z-10 ${feat.glow.replace('/10', '/30')}`} />

                            <div className="group relative bg-white border border-[#f0f0f0] px-8 py-12 rounded-[2rem] w-full max-w-xl text-center shadow-[0_15px_50px_rgba(0,0,0,0.04)] transition duration-700 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">

                                {/* Inner pure white card for icon */}
                                <div className="mx-auto w-16 h-16 mb-8 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-50 transition-transform duration-500 group-hover:-translate-y-2 text-[#0F172A]">
                                    <feat.icon />
                                </div>

                                <h3 className="text-2xl sm:text-3xl text-[#0F172A] font-bold mb-4 tracking-tight">
                                    {feat.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm mx-auto font-medium">
                                    {feat.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
