"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLayerGroup, FaBolt, FaShieldAlt, FaChartPie } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const premiumFeatures = [
    {
        icon: <FaLayerGroup />,
        title: "Advanced Layouts",
        text: "Build stunning rich-text articles with an intuitive drag-and-drop editor and seamless media integration.",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "group-hover:border-cyan-500/50"
    },
    {
        icon: <FaBolt />,
        title: "Lightning Fast API",
        text: "Experience sub-second load times powered by our highly optimized edge-caching infrastructure.",
        color: "from-purple-500/20 to-fuchsia-500/20",
        border: "group-hover:border-fuchsia-500/50"
    },
    {
        icon: <FaShieldAlt />,
        title: "Enterprise Security",
        text: "Your data is protected with military-grade encryption, automatic backups, and strict privacy controls.",
        color: "from-emerald-500/20 to-teal-500/20",
        border: "group-hover:border-emerald-500/50"
    },
    {
        icon: <FaChartPie />,
        title: "Deep Analytics",
        text: "Understand your audience with real-time insights, traffic sources, and granular engagement metrics.",
        color: "from-orange-500/20 to-amber-500/20",
        border: "group-hover:border-orange-500/50"
    },
];

export default function PremiumFeatures() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
            }
        });

        // Antigravity Header Reveal
        tl.from(".pf-ag-word", {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(1.7)"
        })
            .from(".pf-subtitle", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");

        // 3D Glassmorphism Cards Stagger
        gsap.from(".pf-card", {
            scrollTrigger: {
                trigger: ".pf-grid",
                start: "top 80%",
            },
            y: 60,
            rotationX: 45,
            rotationY: 15,
            z: -100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "elastic.out(1, 0.75)",
            transformPerspective: 1000,
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative w-full bg-black text-white py-20 sm:py-28 overflow-hidden">

            {/* BACKGROUND GLOWS */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 relative z-10">

                {/* HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight overflow-hidden flex flex-wrap justify-center gap-2 pb-2">
                        {"Elevate Your Publishing Experience".split(" ").map((word, i) => (
                            <span key={i} className="pf-ag-word inline-block">{word}</span>
                        ))}
                    </h2>
                    <p className="pf-subtitle mt-6 text-gray-400 text-base sm:text-lg">
                        Discover the powerful features that make Blogify the ultimate platform for modern creators and developers.
                    </p>
                </div>

                {/* GRID */}
                <div className="pf-grid grid sm:grid-cols-2 gap-6 sm:gap-8">
                    {premiumFeatures.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`pf-card group relative p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition duration-500 hover:-translate-y-2 ${feature.border}`}
                        >
                            {/* Card Glow */}
                            <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none`} />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl text-white mb-6 border border-white/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                                    {feature.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
