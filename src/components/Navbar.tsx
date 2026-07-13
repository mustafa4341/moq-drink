"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface NavbarProps {
  onMoodFinderClick: () => void;
}

export default function Navbar({ onMoodFinderClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("ANASAYFA");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sahilPulse, setSahilPulse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pulse the Canlı Sahil button every few seconds to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setSahilPulse(true);
      setTimeout(() => setSahilPulse(false), 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, []);

  const centerLinks: { name: string; href: string; action?: () => void }[] = [
    { name: "LEZZETLER", href: "#taste-journey" },
    { name: "HİKAYEMİZ", href: "#story" },
    { name: "TOPLULUK", href: "#sahilin-nabzi" },
  ];

  const handleSahilClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveLink("CANLI SAHİL");
    scrollTo("#sahilin-nabzi");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "bg-white/35 backdrop-blur-xl border-b border-white/40 shadow-[0_10px_35px_rgba(15,108,189,0.03)] py-4"
            : "bg-transparent py-7"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between gap-6">

          {/* ── LEFT: Logo ── */}
          <a
            href="#home"
            onClick={() => { setActiveLink("ANASAYFA"); scrollTo("#home"); }}
            className="flex items-center select-none group outline-none flex-shrink-0"
          >
            <div className="relative w-[75px] h-[36px]">
              <Image
                src="/images/logo_v3.png"
                alt="MOQ Logo"
                fill
                className="object-contain transition-all duration-300 group-hover:scale-[1.03]"
                style={{ filter: "drop-shadow(0px 2px 4px rgba(15, 108, 189, 0.05))" }}
              />
            </div>
          </a>

          {/* ── CENTER: Nav Links (Desktop) ── */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {centerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(link.name);
                  if (link.action) {
                    link.action();
                  } else {
                    scrollTo(link.href);
                  }
                }}
                className="relative text-[11px] font-extrabold tracking-[0.15em] text-brand-navy hover:text-brand-blue-text transition-colors duration-300 py-1 uppercase whitespace-nowrap"
              >
                {link.name}
                {activeLink === link.name && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-brand-blue-text"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* ── RIGHT: MOQU'NU BUL (orange) + divider + CANLI SAHİL (blue) ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">

            {/* MOQU'NU BUL — orange gradient CTA button */}
            <motion.a
              href="#mood-finder"
              onClick={(e) => { e.preventDefault(); setActiveLink("MOQU'NU BUL"); onMoodFinderClick(); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-full text-[10px] font-black tracking-[0.18em] uppercase overflow-hidden border transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                borderColor: "rgba(249, 115, 22, 0.4)",
                color: "#fff",
                boxShadow: "0 0 18px rgba(249,115,22,0.25)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              <span>MOQU&apos;NU BUL</span>
            </motion.a>

            {/* Vertical divider */}
            <div className="w-px h-5 bg-brand-navy/20 rounded-full" />

            {/* CANLI SAHİL CTA */}
            <motion.a
              href="#sahilin-nabzi"
              onClick={handleSahilClick}
              animate={sahilPulse ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-full text-[10px] font-black tracking-[0.18em] uppercase overflow-hidden border transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0f6cbd 100%)",
                borderColor: "rgba(14, 165, 233, 0.4)",
                color: "#fff",
                boxShadow: "0 0 18px rgba(14,165,233,0.25)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <Waves className="w-3.5 h-3.5 flex-shrink-0" />
              <span>CANLI SAHİL</span>
            </motion.a>
          </div>

          {/* ── MOBILE: Hamburger ── */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-11 h-11 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-brand-navy transition-all duration-300 focus:outline-none"
            aria-label="Menüyü Aç"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect width="18" height="2" rx="1" fill="currentColor" />
              <rect y="5" width="12" height="2" rx="1" fill="currentColor" />
              <rect y="10" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white/96 backdrop-blur-2xl z-[100] flex flex-col justify-center items-center"
          >
            {/* Close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-100/80 text-brand-navy flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Links */}
            <nav className="flex flex-col items-center space-y-8">
              {centerLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setActiveLink(link.name);
                    if (link.action) {
                      setTimeout(link.action, 450);
                    } else {
                      setTimeout(() => scrollTo(link.href), 400);
                    }
                  }}
                  className="text-2xl font-black tracking-widest text-brand-navy hover:text-brand-blue-text transition-colors duration-300 uppercase"
                >
                  {link.name}
                </motion.a>
              ))}

              {/* Canlı Sahil CTA in mobile menu */}
              <motion.a
                href="#sahilin-nabzi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: centerLinks.length * 0.07 + 0.15 }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  setTimeout(() => scrollTo("#sahilin-nabzi"), 400);
                }}
                className="flex items-center space-x-2.5 px-7 py-4 rounded-full text-white font-black text-[11px] tracking-[0.2em] uppercase mt-4"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0f6cbd 100%)",
                  boxShadow: "0 6px 24px rgba(14,165,233,0.35)",
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                <Waves className="w-4 h-4" />
                <span>CANLI SAHİL</span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
