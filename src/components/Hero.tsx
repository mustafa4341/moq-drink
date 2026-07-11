"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   HERO — Scene 1: The Arrival
   
   Aligns 100% with the user's reference mockup:
   - Full-bleed background: /images/hero_background.png (ChatGPT Image)
   - Left side: 
     - Small label: "WELCOME TO MOQ DRINK"
     - Large Heading: "More Than A Drink." (Drink. is brand blue)
     - Turkish subtext: "Her yudumda ferahlık, her anında sen. MOQ Drink ile modunu keşfet."
     - CTA Button: "KEŞFET ->"
   - Right side: Empty spacer letting the background's portal design show
   - Subtly animated mouse parallax on the background image for premium depth
   ═══════════════════════════════════════════════════════════════ */

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isMobile = useIsMobile();

  // Parallax coordinates from mouse movement — PERF-3: disabled on mobile
  const pX = useMotionValue(0);
  const pY = useMotionValue(0);

  // Smooth springs for background parallax movement
  const bgTranslateX = useSpring(
    useTransform(pX, [-0.5, 0.5], [-12, 12]),
    { stiffness: 50, damping: 22 }
  );
  const bgTranslateY = useSpring(
    useTransform(pY, [-0.5, 0.5], [-12, 12]),
    { stiffness: 50, damping: 22 }
  );

  // Hide scroll hint once the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // PERF-3: Mouse parallax event handler — only attaches on desktop
  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return; // Guard: mobile never processes mouse parallax
    const width = window.innerWidth;
    const height = window.innerHeight;
    pX.set(e.clientX / width - 0.5);
    pY.set(e.clientY / height - 0.5);
  };

  const handleDiscoverClick = () => {
    document.getElementById("mood-finder")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExploreClick = () => {
    document.getElementById("worlds-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
      className="relative h-[95dvh] lg:h-screen w-full flex items-center justify-center px-6 md:px-12 overflow-hidden z-20 bg-white"
    >
      {/* ── 100% Visual Match Background Image with Mouse Parallax ── */}
      {/* PERF-3: Parallax transform only applied on desktop */}
      <motion.div
        style={isMobile ? { scale: 1.04 } : {
          x: bgTranslateX,
          y: bgTranslateY,
          scale: 1.04, // slightly scaled up to support parallax edges without clipping
        }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <Image
          src="/images/hero_background.webp"
          alt="MOQ Hero Background"
          fill
          priority
          sizes="(max-width: 767px) 700px, (max-width: 1024px) 1200px, 1920px"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Light overlay on the left to ensure readability of typography */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none z-[1]" />

      <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* ── Left Column: Editorial Typography ──────────────── */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 relative z-30 mt-12 lg:mt-0">
          
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-[11px] font-black tracking-[0.3em] text-brand-blue-text uppercase leading-none"
          >
            WELCOME TO MOQ DRINK
          </motion.span>

          <div className="flex flex-col space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="type-hero text-brand-navy font-sans leading-none"
            >
              More Than
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="type-hero text-brand-navy font-sans leading-none"
            >
              A <span className="text-brand-blue-text">Drink.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="type-scene-subtitle text-brand-slate max-w-md font-semibold leading-relaxed"
          >
            Her yudumda ferahlık, her anında sen. MOQ Drink ile modunu keşfet.
          </motion.p>

          {/* Clean Light-Blue CTA button matching screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-2"
          >
            <Magnetic range={30} strength={0.25}>
              <button
                onClick={handleDiscoverClick}
                className="type-button group flex items-center space-x-3 bg-brand-blue-bg hover:bg-brand-blue-text text-brand-blue-text hover:text-white px-8 py-4 rounded-full border border-brand-blue-text/25 shadow-[0_8px_30px_rgba(56,139,230,0.05)] hover:shadow-[0_15px_45px_rgba(56,139,230,0.2)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <span className="font-extrabold tracking-widest text-[10px] md:text-[11px]">KEŞFET</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* ── Right Column: Empty spacer letting background's portal show ── */}
        <div className="lg:col-span-6 hidden lg:block" />
      </div>

      {/* ── Scroll Hint ─────────────────────────────────────── */}
      <motion.div
        onClick={handleExploreClick}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 cursor-pointer z-30 select-none group"
        animate={{ opacity: hasScrolled ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: hasScrolled ? "none" : "auto" }}
      >
        <span className="type-label text-brand-slate group-hover:text-brand-blue-text transition-colors duration-300">
          AŞAĞI KAYDIR
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-brand-slate group-hover:text-brand-blue-text transition-colors duration-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}
