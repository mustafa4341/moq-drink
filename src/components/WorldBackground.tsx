"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   MOQ WORLD BACKGROUND — 11-Layer Living Background System
   Every layer shifts as the user scrolls through scenes.
   ═══════════════════════════════════════════════════════════════ */

// Color stops for day-cycle sky interpolation: [R, G, B]
const SKY_STOPS = [
  {
    pct: 0.0,   // Morning — soft warm cream
    c1: [253, 247, 244],
    c2: [226, 239, 252],
    c3: [208, 230, 251],
  },
  {
    pct: 0.28,  // Midday — bright sky
    c1: [247, 250, 255],
    c2: [216, 236, 253],
    c3: [194, 225, 251],
  },
  {
    pct: 0.58,  // Afternoon Warmth
    c1: [250, 249, 244],
    c2: [226, 235, 245],
    c3: [210, 226, 243],
  },
  {
    pct: 0.8,  // Golden Hour
    c1: [254, 243, 229],
    c2: [251, 217, 181],
    c3: [246, 196, 147],
  },
  {
    pct: 1.0,  // Sunset / Dusk
    c1: [251, 230, 229],
    c2: [245, 201, 226],
    c3: [36, 43, 62],
  },
];

// Light bloom colors per scene phase
const BLOOM_STOPS = [
  { pct: 0.0, color: [255, 248, 235], opacity: 0.12 },   // Morning warm
  { pct: 0.28, color: [210, 235, 255], opacity: 0.15 },   // Midday cool
  { pct: 0.58, color: [245, 235, 210], opacity: 0.14 },   // Afternoon warm
  { pct: 0.8, color: [255, 210, 140], opacity: 0.18 },    // Golden hour
  { pct: 1.0, color: [255, 180, 120], opacity: 0.10 },    // Sunset deep
];

// Ambient glow colors per phase
const GLOW_STOPS = [
  { pct: 0.0, color: "rgba(253, 240, 220, 0.08)" },
  { pct: 0.28, color: "rgba(200, 225, 255, 0.10)" },
  { pct: 0.58, color: "rgba(240, 230, 200, 0.10)" },
  { pct: 0.8, color: "rgba(255, 200, 140, 0.14)" },
  { pct: 1.0, color: "rgba(200, 140, 180, 0.08)" },
];

// SVG leaf paths
const LEAF_PATHS = [
  "M50,0 C65,25 75,45 75,70 C75,85 62,95 50,95 C38,95 25,85 25,70 C25,45 35,25 50,0 Z",
  "M50,5 C68,22 80,48 78,73 C76,87 63,97 50,95 C37,97 24,87 22,73 C20,48 32,22 50,5 Z",
  "M50,2 C70,20 82,50 78,78 C76,88 64,98 50,95 C36,98 24,88 22,78 C18,50 30,20 50,2 Z",
];

interface Particle {
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  spinSpeed: number;
}

function interpolateRGB(c1: number[], c2: number[], factor: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
  return `rgb(${r},${g},${b})`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findSegment(progress: number, stops: any[]) {
  let start = stops[0];
  let end = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (progress >= stops[i].pct && progress <= stops[i + 1].pct) {
      start = stops[i];
      end = stops[i + 1];
      break;
    }
  }
  const range = end.pct - start.pct;
  const factor = range === 0 ? 0 : (progress - start.pct) / range;
  return { start, end, factor };
}

function lerpColor(stops: { pct: number; color: number[] }[], progress: number): string {
  const { start, end, factor } = findSegment(progress, stops);
  const c = interpolateRGB(start.color, end.color, factor);
  return c;
}

function lerpValue(stops: { pct: number; opacity: number }[], progress: number): number {
  const { start, end, factor } = findSegment(progress, stops);
  return start.opacity + (end.opacity - start.opacity) * factor;
}

import { useIsMobile } from "@/hooks/useIsMobile";
import { animationManager } from "@/lib/animation/AnimationManager";

export default function WorldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    animationManager.init();
    setProfile(animationManager.getProfile());

    const handleProfileChange = (e: Event) => {
      setProfile((e as CustomEvent).detail);
    };

    window.addEventListener("moq-profile-changed", handleProfileChange);
    return () => {
      window.removeEventListener("moq-profile-changed", handleProfileChange);
      animationManager.destroy();
    };
  }, []);

  const handleScroll = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
    setScrollProgress(progress);
  }, []);

  // Track scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Compute interpolated gradient (Layer 0 — Base sky)
  const getBackgroundStyle = () => {
    const { start, end, factor } = findSegment(scrollProgress, SKY_STOPS);
    const stop1 = interpolateRGB(start.c1, end.c1, factor);
    const stop2 = interpolateRGB(start.c2, end.c2, factor);
    const stop3 = interpolateRGB(start.c3, end.c3, factor);

    // Sun position shifts from top-center to top-right
    const sunX = 50 + scrollProgress * 15;

    return {
      background: `radial-gradient(ellipse at ${sunX}% 30%, ${stop1} 0%, ${stop2} 55%, ${stop3} 100%)`,
    };
  };

  // Canvas particle system (Layer 6 — Particles)
  useEffect(() => {
    if (profile === "mobile") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    
    // Read count from profile
    const count = profile === "tablet" ? 18 : 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3.5 + 1.2,
        speedY: -(Math.random() * 0.35 + 0.12),
        speedX: Math.random() * 0.18 - 0.09,
        opacity: Math.random() * 0.3 + 0.08,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: Math.random() * 0.008 - 0.004,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.angle += p.spinSpeed;
        p.x += p.speedX + Math.sin(p.angle) * 0.06;
        if (p.y < -p.r) {
          p.y = canvas.height + p.r;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [profile]);

  // Bloom & glow interpolated values
  const bloomColor = lerpColor(BLOOM_STOPS, scrollProgress);
  const bloomOpacity = lerpValue(BLOOM_STOPS, scrollProgress);

  // Pick glow color based on current scroll phase
  const glowColor = GLOW_STOPS.reduce((acc, stop, i) => {
    if (scrollProgress >= stop.pct) return GLOW_STOPS[i].color;
    return acc;
  }, GLOW_STOPS[0].color);

  // Sun ray position shifts with scroll
  const sunRayX = 50 + scrollProgress * 15;

  // Ultra-light mobile background
  if (profile === "mobile") {
    return (
      <div
        className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
        style={{ ...getBackgroundStyle(), transition: "background 700ms ease-out" }}
      >
        {/* Layer 2: Cloud Layer Mid (40s) - Simplified (no heavy blur) */}
        <div className="absolute top-[15%] left-0 w-full h-24 opacity-[0.10] overflow-hidden">
          <div className="absolute w-[300px] h-16 bg-white/60 rounded-full animate-cloud-drift-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
      style={{ ...getBackgroundStyle(), transition: "background 700ms ease-out" }}
    >
      {/* ── Layer 1: Cloud Layer Far (55s) ────────────────────── */}
      <div className="absolute top-[6%] left-0 w-full h-28 opacity-[0.18] overflow-hidden">
        <div className="absolute w-[600px] h-24 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-3xl animate-cloud-drift-1" />
        <div className="absolute w-[500px] h-20 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-3xl animate-cloud-drift-1" style={{ animationDelay: "-20s", top: "30px" }} />
      </div>

      {/* ── Layer 2: Cloud Layer Mid (40s) ────────────────────── */}
      <div className="absolute top-[15%] left-0 w-full h-24 opacity-[0.15] overflow-hidden">
        <div className="absolute w-[450px] h-20 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-2xl animate-cloud-drift-2" />
        <div className="absolute w-[350px] h-16 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-2xl animate-cloud-drift-2" style={{ animationDelay: "-15s", top: "20px" }} />
      </div>

      {/* ── Layer 3: Cloud Layer Near (28s) ───────────────────── */}
      {profile === "desktop" && (
        <div className="absolute top-[25%] left-0 w-full h-20 opacity-[0.12] overflow-hidden">
          <div className="absolute w-[380px] h-16 bg-gradient-to-r from-transparent via-white/65 to-transparent blur-xl animate-cloud-drift-3" />
          <div className="absolute w-[300px] h-14 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-xl animate-cloud-drift-3" style={{ animationDelay: "-10s", top: "15px" }} />
        </div>
      )}

      {/* ── Layer 4: Sun Rays ──────────────────────────────────── */}
      <div
        className="absolute top-0 w-full h-[60vh] opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${sunRayX}% 0%, rgba(255,220,140,0.4) 0%, transparent 60%)`,
          transition: "background 700ms ease-out",
        }}
      />

      {/* ── Layer 5: Noise Texture ───────────────────────────── */}
      <div
        className="noise-overlay"
        style={{ opacity: 0.03 }}
      />

      {/* ── Layer 6: Particles (Canvas) ───────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen opacity-50"
      />

      {/* ── Layer 7: Light Bloom ─────────────────────────────── */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${bloomColor} 0%, transparent 70%)`,
          opacity: bloomOpacity,
          transition: "all 700ms ease-out",
        }}
      />

      {/* ── Layer 8: Water Reflection ─────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[35vh] opacity-20 pointer-events-none mix-blend-overlay animate-water-ripple"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, rgba(56,139,230,0.12) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* ── Layer 9: SVG Leaves (6-8 leaves, 18s cycle) ─────── */}
      {profile === "desktop" && [...Array(7)].map((_, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none opacity-[0.15]"
          style={{
            width: `${14 + (i % 3) * 6}px`,
            height: `${20 + (i % 3) * 8}px`,
            top: `${10 + (i * 12) % 80}%`,
            left: `${5 + (i * 17) % 85}%`,
            animation: `drift-leaves 18s ease-in-out infinite`,
            animationDelay: `${i * 2.6}s`,
            fill: i % 2 === 0 ? "rgba(120,180,80,0.6)" : "rgba(100,160,60,0.5)",
            transform: `rotate(${i * 30}deg)`,
          }}
          viewBox="0 0 100 100"
        >
          <path d={LEAF_PATHS[i % LEAF_PATHS.length]} />
        </svg>
      ))}

      {/* ── Layer 10: Mist / Fog ─────────────────────────────── */}
      <div
        className="absolute bottom-[5%] left-0 w-full h-32 blur-3xl animate-mist-drift pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.25) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-[40%] left-0 w-full h-20 blur-3xl animate-mist-drift pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.18) 60%, transparent 100%)",
          animationDelay: "-8s",
        }}
      />

      {/* ── Layer 11: Ambient Glow ───────────────────────────── */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
          transition: "background 700ms ease-out",
        }}
      />
    </div>
  );
}
