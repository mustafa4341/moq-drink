"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/useIsMobile";
import { animationManager } from "@/lib/animation/AnimationManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════
   MOQ WORLD BACKGROUND — 11-Layer Living Background System
   Optimized architecture: Stacked DOM layers cross-faded via GSAP
   ScrollTrigger to prevent React scroll state re-renders (ZERO lag).
   ═══════════════════════════════════════════════════════════════ */

// Static radial gradients for each phase
const GRADIENTS = [
  "radial-gradient(ellipse at 50% 30%, rgb(253,247,244) 0%, rgb(226,239,252) 55%, rgb(208,230,251) 100%)", // Morning
  "radial-gradient(ellipse at 55% 30%, rgb(247,250,255) 0%, rgb(216,236,253) 55%, rgb(194,225,251) 100%)", // Midday
  "radial-gradient(ellipse at 60% 30%, rgb(250,249,244) 0%, rgb(226,235,245) 55%, rgb(210,226,243) 100%)", // Afternoon
  "radial-gradient(ellipse at 62% 30%, rgb(254,243,229) 0%, rgb(251,217,181) 55%, rgb(246,196,147) 100%)", // Golden Hour
  "radial-gradient(ellipse at 65% 30%, rgb(251,230,229) 0%, rgb(245,201,226) 55%, rgb(36,43,62) 100%)"    // Sunset
];

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

export default function WorldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<"mobile" | "tablet" | "desktop" | null>(null);

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

  // GSAP ScrollTrigger to animate stacked layers based on scroll position (bypasses React renders)
  useEffect(() => {
    const container = layersContainerRef.current;
    if (!container) return;
    const layers = container.children;
    if (layers.length < 5) return;

    // We animate Layer 1 (Midday), 2 (Afternoon), 3 (Golden Hour), and 4 (Sunset) opacities
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1, // extremely snappy & direct, matches touch scroll instantly
        invalidateOnRefresh: true,
      }
    });

    // Layer 1 (Midday) fades in from 0 to 0.25, then fades out from 0.25 to 0.50
    tl.to(layers[1], { opacity: 1, ease: "none", duration: 0.25 }, 0)
      .to(layers[1], { opacity: 0, ease: "none", duration: 0.25 }, 0.25)
      
      // Layer 2 (Afternoon) fades in from 0.25 to 0.50, fades out from 0.50 to 0.75
      .to(layers[2], { opacity: 1, ease: "none", duration: 0.25 }, 0.25)
      .to(layers[2], { opacity: 0, ease: "none", duration: 0.25 }, 0.50)

      // Layer 3 (Golden Hour) fades in from 0.50 to 0.75, fades out from 0.75 to 0.95
      .to(layers[3], { opacity: 1, ease: "none", duration: 0.25 }, 0.50)
      .to(layers[3], { opacity: 0, ease: "none", duration: 0.20 }, 0.75)

      // Layer 4 (Sunset) fades in from 0.75 to 0.95 and stays
      .to(layers[4], { opacity: 1, ease: "none", duration: 0.20 }, 0.75)
      
      // Sun Rays / Bloom animations
      .to(".sun-rays", { opacity: 0.35, ease: "none", duration: 0.50 }, 0)
      .to(".sun-rays", { opacity: 0.08, ease: "none", duration: 0.45 }, 0.50)
      
      .to(".bloom-layer", { opacity: 0.15, scale: 1.1, ease: "none", duration: 0.50 }, 0)
      .to(".bloom-layer", { opacity: 0.08, scale: 1.0, ease: "none", duration: 0.45 }, 0.50);

    return () => {
      tl.kill();
      if (ScrollTrigger.getById("body")) {
        ScrollTrigger.getById("body")?.kill();
      }
    };
  }, [profile]);

  // Canvas particle system (Layer 6 — Particles, Desktop/Tablet only)
  useEffect(() => {
    if (!profile || profile === "mobile") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    
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

  if (isMobile === null || !profile) {
    return (
      <div
        className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none bg-[#F7FAFF]"
      />
    );
  }

  // Ultra-light mobile background
  if (profile === "mobile") {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
        {/* Stacked background gradient layers */}
        <div ref={layersContainerRef} className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full" style={{ background: GRADIENTS[0] }} />
          <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[1] }} />
          <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[2] }} />
          <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[3] }} />
          <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[4] }} />
        </div>

        {/* Layer 2: Cloud Layer Mid (40s) - Simplified (no heavy blur) */}
        <div className="absolute top-[15%] left-0 w-full h-24 opacity-[0.10] overflow-hidden">
          <div className="absolute w-[300px] h-16 bg-white/60 rounded-full animate-cloud-drift-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      {/* Stacked background gradient layers */}
      <div ref={layersContainerRef} className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full" style={{ background: GRADIENTS[0] }} />
        <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[1] }} />
        <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[2] }} />
        <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[3] }} />
        <div className="absolute inset-0 w-full h-full opacity-0" style={{ background: GRADIENTS[4] }} />
      </div>

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
        className="absolute top-0 w-full h-[60vh] opacity-20 pointer-events-none sun-rays"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,220,140,0.4) 0%, transparent 60%)",
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
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-full pointer-events-none mix-blend-screen bloom-layer"
        style={{
          background: "radial-gradient(circle, rgb(210, 235, 255) 0%, transparent 70%)",
          opacity: 0.12,
        }}
      />

      {/* ── Layer 8: Water Reflection ─────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[35vh] opacity-20 pointer-events-none mix-blend-overlay animate-water-ripple"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(56,139,230,0.12) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* ── Layer 9: SVG Leaves ───────────────────────────────── */}
      {profile === "desktop" && [...Array(7)].map((_, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none opacity-[0.15]"
          style={{
            width: `${14 + (i % 3) * 6}px`,
            height: `${20 + (i % 3) * 8}px`,
            top: `${10 + (i * 12) % 80}%`,
            left: `${5 + (i * 17) % 85}%`,
            animation: "drift-leaves 18s ease-in-out infinite",
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
    </div>
  );
}
