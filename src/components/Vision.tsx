"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   VISION — Scene 5: The Statement
   
   "WE DON'T MAKE DRINKS. WE CREATE MOODS."
   
   - Scroll-triggered sequential reveal (each line appears one by one)
   - Subtle float animation on text block
   - Clean white background (contrast / palette cleanser)
   
   Each line is its own component so hooks stay at top level.
   ═══════════════════════════════════════════════════════════════ */

interface VisionLine {
  text: string;
  highlight: boolean;
}

const visionLines: VisionLine[] = [
  { text: "BİZ", highlight: false },
  { text: "İÇECEK", highlight: false },
  { text: "YAPMIYORUZ.", highlight: true },
  { text: "BİZ MODLAR", highlight: false },
  { text: "YARATIYORUZ.", highlight: true },
];

// Single line — hooks at top level (valid)
function VisionTextLine({
  line,
  index,
  scrollYProgress,
}: {
  line: VisionLine;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const revealAt = 0.15 + index * 0.15;

  const opacity = useTransform(
    scrollYProgress,
    [revealAt - 0.1, revealAt, revealAt + 0.15, revealAt + 0.25],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [revealAt - 0.1, revealAt, revealAt + 0.15, revealAt + 0.25],
    [30, 0, 0, -30]
  );

  return (
    <motion.span
      style={{ opacity, y }}
      className={`text-5xl md:text-8xl lg:text-9xl font-black text-brand-navy leading-[0.85] tracking-tighter uppercase font-sans ${
        line.highlight ? "text-brand-blue-text" : ""
      }`}
    >
      {line.text}
    </motion.span>
  );
}

export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden z-20 select-none scene"
    >
      {/* Clean white base */}
      <div className="absolute inset-0 bg-white" />

      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[50vh] rounded-full pointer-events-none opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, rgba(93,169,255,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Text block with float animation */}
      <motion.div
        animate={{
          y: [0, -12, 12, 0],
          rotate: [0, 0.5, -0.5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl px-6"
      >
        {visionLines.map((line, index) => (
          <VisionTextLine
            key={index}
            line={line}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </motion.div>
    </section>
  );
}
