"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   TRANSITION TEXT — Reusable cinematic transitions between scenes
   
   A large editorial text that fades in/out as the user scrolls
   through a 50vh buffer zone.
   
   Animation:
     - opacity: 0 → 1 → 0
     - scale: 0.95 → 1 → 0.95
     - y: 30 → 0 → -30
     - Duration: 1200ms easing
   
   Transitions defined in page.tsx:
     Hero → Carousel:    "Every flavor / has its own / world."
     Carousel → Worlds:  "Enter the worlds."
     Worlds → Story:     "How it all began..."
     Vision → Mood:      "What do you feel today?"
     Philosophy → Insta: "Join the world."
   ═══════════════════════════════════════════════════════════════ */

interface TransitionTextProps {
  lines: string[];
  /** Center text or left-aligned */
  align?: "center" | "left";
  /** Italic style */
  italic?: boolean;
  /** Warm color tones */
  warm?: boolean;
  /** Glowing text effect */
  glowing?: boolean;
  /** Additional CSS class */
  className?: string;
}

export default function TransitionText({
  lines,
  align = "center",
  italic = false,
  warm = false,
  glowing = false,
  className = "",
}: TransitionTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Use inView triggering on mobile for absolute reliability & smoothness (regardless of scroll speed)
  const inView = useInView(containerRef, { once: false, amount: 0.35 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to opacity, scale, y for fade in/out (Desktop scroll parallax)
  const opacityScroll = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const scaleScroll = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.95, 1, 0.95]);
  const yScroll = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [30, 0, -30]);

  const isFirstTransition = lines[0] === "Her lezzetin";
  const isDuplicateTransition = lines[0] === "Dünyalara adım atın.";
  
  // Increase heights on mobile slightly to give scrolling more natural vertical spacing
  const sectionHeight = isMobile ? (isFirstTransition ? "280px" : "200px") : "50vh";

  if (isMobile && isDuplicateTransition) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${align === "center" ? "text-center px-6" : "text-left px-6 md:px-12 max-w-[1280px] mx-auto w-full"} ${className}`}
      style={{ height: sectionHeight }}
    >
      <motion.div
        // On mobile: Animate smoothly via native inView events. On desktop: Bind dynamically to scroll progress.
        style={isMobile ? undefined : { opacity: opacityScroll, scale: scaleScroll, y: yScroll }}
        animate={isMobile ? {
          opacity: inView ? 1 : 0,
          scale: inView ? 1 : 0.96,
          y: inView ? 0 : 25,
        } : undefined}
        transition={isMobile ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] } : undefined}
        className={`flex flex-col ${align === "center" ? "items-center" : "items-start"} space-y-1`}
      >
        {lines.map((line, index) => (
          <motion.span
            key={index}
            className={`type-transition ${italic ? "italic" : ""} ${
              warm ? "text-brand-orange-text" : "text-brand-navy"
            } ${glowing ? "text-brand-blue-text" : ""} ${
              italic && warm ? "text-brand-orange-text/80" : ""
            }`}
            style={{
              textShadow: glowing
                ? "0 0 40px rgba(56,139,230,0.3), 0 0 80px rgba(56,139,230,0.15)"
                : "none",
            }}
          >
            {line}
          </motion.span>
        ))}

        {isMobile && isFirstTransition && (
          <div className="flex flex-col items-center space-y-1 pt-6 opacity-75">
            <span className="text-[9px] font-black tracking-widest text-brand-slate/80 uppercase">KAYDIR</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-brand-slate/80" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Mist overlay during transition */}
      <motion.div
        style={isMobile ? undefined : { opacity: opacityScroll }}
        animate={isMobile ? { opacity: inView ? 0.8 : 0 } : undefined}
        transition={isMobile ? { duration: 0.5 } : undefined}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute bottom-0 left-0 w-full h-20 blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.2) 60%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
