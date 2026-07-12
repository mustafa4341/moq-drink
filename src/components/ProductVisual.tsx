"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductVisualProps {
  image: string;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
  };
  theme?: {
    particle?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animatePortal?: boolean;
  isInView?: boolean;
  isMobile?: boolean;
}

export default function ProductVisual({
  image,
  name,
  emoji,
  colors,
  theme,
  className = "",
  size = "md",
  animatePortal = false,
  isInView = true,
  isMobile = false,
}: ProductVisualProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Responsive sizes for the outer container
  const sizeClasses = {
    sm: "w-[100px] h-[100px]",
    md: "w-[170px] h-[170px] md:w-[200px] md:h-[200px]",
    lg: "w-[240px] h-[240px] md:w-[280px] md:h-[280px]",
    xl: "w-[300px] h-[450px] md:w-[380px] md:h-[510px] rounded-t-full",
  };

  const emojiClasses = {
    sm: "text-2xl",
    md: "text-4xl md:text-5xl",
    lg: "text-6xl md:text-7xl",
    xl: "text-8xl",
  };

  // Breathing animation configuration
  const breathingDuration = isMobile ? 8 : 10;
  const breathingMaxScale = isMobile ? 1.01 : 1.015;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shadow-lg border border-white/30 select-none ${sizeClasses[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}25 100%)`,
        contain: "paint",
      }}
    >
      {/* ── 1. Blur Blob ── */}
      <div
        className="absolute w-[80%] h-[80%] rounded-full opacity-60 blur-2xl pointer-events-none transition-transform"
        style={{
          background: `radial-gradient(circle, ${colors.primary}44 0%, transparent 70%)`,
          transform: "scale(1.2)",
          willChange: "transform",
        }}
      />

      {/* ── 2. Glass Circle (Breathing Animation) ── */}
      <motion.div
        animate={
          animatePortal
            ? {
                scale: [1, breathingMaxScale, 1],
              }
            : {}
        }
        transition={
          animatePortal
            ? {
                duration: breathingDuration,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
        className={`absolute rounded-full border border-white/40 bg-white/10 backdrop-blur-[6px] shadow-inner flex items-center justify-center overflow-hidden z-[2] ${
          size === "xl" ? "w-[260px] h-[260px] md:w-[320px] md:h-[320px]" : "w-[85%] h-[85%]"
        }`}
      >
        {/* Rotating Content Container (for background + waves) */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={
            animatePortal
              ? {
                  animation: "spin-slow 45s linear infinite",
                }
              : {}
          }
        >
          {/* ── 3. Gradient Liquid ── */}
          <div
            className="absolute bottom-0 left-0 w-full h-[60%] opacity-85 z-0"
            style={{
              background: `linear-gradient(0deg, ${colors.primary}dd 0%, ${colors.secondary}66 100%)`,
              borderRadius: "0 0 160px 160px",
            }}
          />

          {/* Liquid Wave Effect */}
          <div
            className="absolute bottom-[54%] left-[-50%] w-[200%] h-[15%] opacity-35 bg-white/40 z-[1]"
            style={{
              borderRadius: "44%",
              animation: "spin 12s linear infinite",
            }}
          />
        </div>

        {/* ── 4. Floating Fruit / Themed Icon (Spring entrance + idle) ── */}
        <motion.div
          initial={{ y: -150, opacity: 0, rotate: 0 }}
          animate={
            isInView
              ? {
                  y: 0,
                  opacity: 1,
                  rotate: isMobile ? [-2, 2, -2] : [0, -3, 3, 0],
                }
              : { y: -150, opacity: 0 }
          }
          transition={{
            y: {
              type: "spring",
              stiffness: 100,
              damping: 9,
              delay: 0.7,
            },
            opacity: { duration: 0.4, delay: 0.7 },
            rotate: {
              repeat: Infinity,
              duration: isMobile ? 12 : 8,
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
          className={`relative z-[3] pointer-events-none drop-shadow-md select-none ${emojiClasses[size]}`}
          style={{
            willChange: "transform",
          }}
        >
          {emoji}
        </motion.div>

        {/* ── 5. Highlight (Apple glass reflection gleam) ── */}
        <div className="absolute top-3 left-6 w-[35%] h-[10%] bg-white/40 rounded-full rotate-[-15deg] blur-[1.5px] z-[4]" />

        {/* Dynamic moving glare line (Awwwards details) */}
        {animatePortal && (
          <div
            className="absolute top-0 left-0 w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent z-[5] pointer-events-none"
            style={{
              animation: "glint 12s ease-in-out infinite",
            }}
          />
        )}

        {/* ── 6. Static Glass Reflection ── */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none z-[5]" />
      </motion.div>

      {/* ── 7. Image Overlay ── */}
      {!hasError && image && (
        <Image
          src={image}
          alt={name}
          fill
          priority={size === "sm" || size === "md"}
          sizes={
            size === "sm"
              ? "100px"
              : size === "md"
              ? "200px"
              : size === "lg"
              ? "280px"
              : "380px"
          }
          className={`object-cover w-full h-full z-10 transition-all duration-500 ease-in-out ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}

      {/* Embedded CSS animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes glint {
          0% { transform: translate(-150%, -25%) rotate(25deg); }
          40%, 100% { transform: translate(250%, -25%) rotate(25deg); }
        }
      `}</style>
    </div>
  );
}
