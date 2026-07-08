"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";

interface NavbarProps {
  onMoodFinderClick: () => void;
}

export default function Navbar({ onMoodFinderClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("HOME");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "ANASAYFA", href: "#home" },
    { name: "İMZA SERİSİ", href: "#drinks" },
    { name: "HİKAYEMİZ", href: "#story" },
    { name: "MOD BULUCU", href: "#mood-finder", action: onMoodFinderClick },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-moq ${
          scrolled
            ? "bg-white/35 backdrop-blur-xl border-b border-white/40 shadow-[0_10px_35px_rgba(15,108,189,0.03)] py-4"
            : "bg-transparent py-7"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo - Magnetic */}
          <Magnetic range={40} strength={0.25}>
            <a
              href="#home"
              onClick={() => setActiveLink("ANASAYFA")}
              className="flex items-center select-none group outline-none"
            >
              <div className="relative w-[75px] h-[36px]">
                <Image
                  src="/images/logo_v3.png"
                  alt="MOQ Logo"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-[1.03] text-brand-navy"
                  style={{
                    filter: "drop-shadow(0px 2px 4px rgba(15, 108, 189, 0.05))"
                  }}
                />
              </div>
            </a>
          </Magnetic>

          {/* Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                  } else {
                    setActiveLink(link.name);
                    const target = document.querySelector(link.href);
                    if (target) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="relative text-[11px] font-extrabold tracking-[0.18em] text-brand-navy hover:text-brand-blue-text transition-colors duration-300 py-1 uppercase"
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

          {/* Hamburger Menu - Magnetic */}
          <Magnetic range={30} strength={0.3}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 rounded-full bg-white/60 border border-white/80 hover:bg-brand-blue-bg/40 flex items-center justify-center text-brand-navy hover:text-brand-blue-text transition-all duration-300 shadow-[0_4px_12px_rgba(15,108,189,0.03)] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>
          </Magnetic>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col justify-center items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-100/80 hover:bg-brand-blue-bg/30 text-brand-navy hover:text-brand-blue-text flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Mobile Links */}
            <nav className="flex flex-col items-center space-y-9">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (link.action) {
                      e.preventDefault();
                      setTimeout(link.action, 450);
                    } else {
                      setActiveLink(link.name);
                      const target = document.querySelector(link.href);
                      if (target) {
                        e.preventDefault();
                        setTimeout(() => {
                          target.scrollIntoView({ behavior: "smooth" });
                        }, 400);
                      }
                    }
                  }}
                  className="text-2xl font-black tracking-widest text-brand-navy hover:text-brand-blue-text transition-colors duration-300 uppercase"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
