import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";

export function useHeroAnimation(container: RefObject<HTMLElement | null>) {
    useGSAP(() => {
        // 1. Scene setup
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

        // Background Glow Reveal
        tl.from(".hero-glow", {
            scale: 0.5,
            opacity: 0,
            duration: 2,
            ease: "power2.out"
        });

        // Cinematic Text Reveal
        tl.from(".home-ag-word", {
            y: 100,
            opacity: 0,
            rotationX: -90,
            transformOrigin: "0% 50% -50",
            stagger: 0.04,
            ease: "back.out(1.5)",
            duration: 1.2
        }, "-=1.5");

        // Subtext & Badge
        tl.from(".hero-badge", { y: 20, opacity: 0, duration: 1 }, "-=1")
            .from(".hero-desc", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
            .from(".hero-search", { y: 20, opacity: 0, scale: 0.95, duration: 1 }, "-=0.8")
            .from(".hero-topics", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
            .from(".hero-cta", { y: 20, opacity: 0, duration: 1 }, "-=0.8")
            .from(".hero-stats", { y: 20, opacity: 0, duration: 1 }, "-=0.8");

        // Image & Floating Cards Drop
        gsap.from(".hero-image-container", {
            scale: 0.8,
            rotationY: 15,
            z: -200,
            opacity: 0,
            duration: 1.8,
            ease: "expo.out",
            delay: 0.3
        });

        gsap.from(".hero-floating-1", {
            y: 100,
            x: -50,
            rotationZ: -10,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.75)",
            delay: 1.2
        });

        gsap.to(".hero-floating-1", {
            y: "-=20",
            rotationZ: "-=2",
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 2.7
        });

        gsap.from(".hero-floating-2", {
            y: 100,
            x: 50,
            rotationZ: 10,
            opacity: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.75)",
            delay: 1.4
        });

        gsap.to(".hero-floating-2", {
            y: "-=20",
            rotationZ: "+=2",
            duration: 2.8,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 2.9
        });

    }, { scope: container });
}
