"use client";

import React from "react";
import { Instagram, Mail, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   FOOTER — Scene 9: The Sunset (Cinematic Ending)
   
   The user reaches the end of the world. Sun is setting.
   MOQ logo stands as a silhouette against the golden sky.
   
   Design:
     - Multi-layer sunset gradient (warm orange → deep coral → dark indigo)
     - Large sun circle: CSS radial gradient, center, partially below horizon
     - MOQ logo: Large, silhouetted against the sun
     - Ocean: Animated wave SVGs at bottom (2-3 layers, different speeds)
     - Cloud silhouettes: Dark against sunset sky, slow drift
     - Reflection: Sun's light on water surface
   
   Content (minimal, centered, sunset tones):
     - MOQ logo (large, silhouette)
     - "Mood. Sip. Refresh." tagline
     - Navigation links (horizontal, small)
     - Social icons (Instagram, TikTok)
     - Copyright
   ═══════════════════════════════════════════════════════════════ */

export default function Footer() {
  const isMobile = useIsMobile();
  
  const handleMoodFinderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("mood-finder")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isMobile === null) {
    return <footer id="contact" className="relative w-full min-h-[150px] bg-[#242b3e]" />;
  }

  if (isMobile) {
    return (
      <footer
        id="contact"
        className="relative w-full py-12 px-6 z-20 bg-[#242b3e] text-center flex flex-col items-center space-y-8"
        style={{
          background: "linear-gradient(to bottom, #e88c8c 0%, #242b3e 100%)",
        }}
      >
        {/* MOQ Brand Display */}
        <div className="relative w-[140px] h-[70px]">
          <Image
            src="/images/logo_v3.png"
            alt="MOQ Logo"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-2 text-xs font-black tracking-widest text-[#fbe6e5] uppercase">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 py-3 px-6 min-h-[44px]"
          >
            <Instagram className="w-4 h-4" />
            <span>INSTAGRAM</span>
          </a>

          <a
            href="mailto:hello@moqdrink.com"
            className="flex items-center justify-center space-x-2 py-3 px-6 min-h-[44px]"
          >
            <Mail className="w-4 h-4" />
            <span>İLETİŞİM</span>
          </a>
        </div>

        {/* Mockup Vector QR Code */}
        <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
          <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center">
            <div className="grid grid-cols-5 gap-1.5 w-full h-full">
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />

              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />

              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />

              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />

              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy/10 rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
              <div className="bg-brand-navy rounded-sm" />
            </div>
          </div>
          <span className="text-[8px] font-black tracking-wider text-[#fbe6e5]/70 uppercase">MOQ.SIP.REFRESH</span>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-[#fbe6e5]/10 pt-6 text-[9px] text-[#fbe6e5]/40 font-bold">
          <span>© {new Date().getFullYear()} MOQ DRINK.</span>
        </div>
      </footer>
    );
  }

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden pt-32 pb-16 px-6 md:px-12 z-20 scene"
      style={{
        background: "linear-gradient(to bottom, #fbc1ad 0%, #e88c8c 25%, #5e4a6e 55%, #242b3e 100%)",
      }}
    >
      {/* ── Sun Circle ──────────────────────────────────────── */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,220,140,0.8) 0%, rgba(255,180,80,0.4) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Sunset Cloud Silhouettes ────────────────────────── */}
      <div className="absolute top-[20%] left-0 w-full pointer-events-none opacity-15 overflow-hidden">
        <div
          className="absolute w-[500px] h-24 rounded-full blur-2xl animate-mist-drift"
          style={{ background: "rgba(80,50,80,0.6)", left: "5%" }}
        />
        <div
          className="absolute w-[400px] h-20 rounded-full blur-2xl animate-mist-drift"
          style={{ background: "rgba(80,50,80,0.5)", right: "10%", animationDelay: "-8s" }}
        />
        <div
          className="absolute w-[350px] h-16 rounded-full blur-2xl animate-mist-drift"
          style={{ background: "rgba(80,50,80,0.4)", left: "40%", top: "30px", animationDelay: "-14s" }}
        />
      </div>

      {/* ── Water Reflection ────────────────────────────────── */}
      <div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[20vh] pointer-events-none opacity-20"
        style={{
          background: "linear-gradient(to bottom, rgba(255,200,120,0.3) 0%, transparent 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Ocean Waves ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none h-44 z-0">
        {/* Wave Layer 1 */}
        <svg
          className="absolute bottom-0 w-[200%] h-32 fill-[#1a202e]/60 opacity-60 animate-[water-ripple_12s_ease-in-out_infinite]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 L1500,120 L0,120 Z" />
        </svg>
        {/* Wave Layer 2 */}
        <svg
          className="absolute bottom-0 w-[200%] h-24 fill-[#242b3e] opacity-80 animate-[water-ripple_16s_ease-in-out_infinite_-2s]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: "translateX(-25%) scaleY(1.1)" }}
        >
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 L1500,120 L0,120 Z" />
        </svg>
        {/* Wave Layer 3 (foreground) */}
        <svg
          className="absolute bottom-0 w-[200%] h-16 fill-[#242b3e] opacity-90 animate-[water-ripple_10s_ease-in-out_infinite_-5s]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: "translateX(-15%) scaleY(1.15)" }}
        >
          <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 L1500,120 L0,120 Z" />
        </svg>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center space-y-16 relative z-10">
        {/* MOQ Brand Display */}
        <div className="flex flex-col items-center">
          <div className="relative w-[180px] h-[90px] md:w-[240px] md:h-[120px]">
            <Image
              src="/images/logo_v3.png"
              alt="MOQ Logo"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 text-xs font-black tracking-widest text-[#fbe6e5] uppercase">
          <Magnetic range={25} strength={0.3}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center space-x-2 transition-colors duration-300"
            >
              <Instagram className="w-4 h-4" />
              <span>INSTAGRAM</span>
            </a>
          </Magnetic>

          <Magnetic range={25} strength={0.3}>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center space-x-2 transition-colors duration-300"
            >
              <span>TIKTOK</span>
            </a>
          </Magnetic>

          <Magnetic range={25} strength={0.3}>
            <a
              href="#mood-finder"
              onClick={handleMoodFinderClick}
              className="hover:text-white flex items-center space-x-2 transition-colors duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>MOD BULUCU</span>
            </a>
          </Magnetic>

          <Magnetic range={25} strength={0.3}>
            <a
              href="mailto:hello@moqdrink.com"
              className="hover:text-white flex items-center space-x-2 transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>İLETİŞİM</span>
            </a>
          </Magnetic>

          <Magnetic range={25} strength={0.3}>
            <a
              href="#"
              className="hover:text-white flex items-center space-x-2 transition-colors duration-300"
            >
              <Shield className="w-4 h-4" />
              <span>GİZLİLİK</span>
            </a>
          </Magnetic>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-[#fbe6e5]/10 pt-10 flex flex-col md:flex-row items-center justify-between text-[10px] text-[#fbe6e5]/50 font-bold">
          <span>© {new Date().getFullYear()} MOQ DRINK. TÜM HAKLARI SAKLIDIR.</span>
          <span className="mt-2 md:mt-0">PREMIUM MOQ EVRENİ İÇİN TASARLANMIŞTIR</span>
        </div>
      </div>
    </footer>
  );
}
