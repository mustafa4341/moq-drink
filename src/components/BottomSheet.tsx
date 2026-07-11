"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import type { Drink } from "@/lib/product-data";

/* ═══════════════════════════════════════════════════════════════
   BOTTOM SHEET — Shared mobile-only modal for product worlds
   
   PWS-2:  Single shared component — no per-drink duplication
   PWS-3:  Spring-based open animation (cubic-bezier approximation)
   PWS-4:  Backdrop blur only behind modal, never full page
   PWS-7:  Body scroll lock while open
   PWS-8:  Swipe-down, ESC, backdrop click, close button all dismiss
   PWS-9:  Focus trap while open; focus returns to trigger on close
   PWS-10: ARIA role="dialog", aria-modal="true"
   PWS-11: Sheet content: image, name, world, description, ingredients, mood, flavor notes, CTA, close
   PWS-13: Reads atmosphere colors as CSS custom properties
   PWS-14: Particles are CSS-keyframe DOM elements — never canvas
   PWS-15: Hard-caps at 10 particles regardless of data source
   PWS-16: Particles start on open, fully removed on close
   PWS-17: prefers-reduced-motion → gradient only, no particles
   ARCH-3: Loaded via next/dynamic with ssr:false (in parent)
   ARCH-7: One reusable component
   ═══════════════════════════════════════════════════════════════ */

interface BottomSheetProps {
  drink: Drink | null;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

const MAX_PARTICLES = 10; // PWS-15 hard cap

/** Reduced-motion check for PWS-17 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** Detect iOS Safari for PWS-5 blur heuristic */
function isIOSSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  return iOS && webkit && !/CriOS|FxiOS/.test(ua);
}

export default function BottomSheet({ drink, isOpen, onClose, triggerRef }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // PWS-7: Body scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // PWS-9: Focus trap + restore focus on close
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;

    // Store previously focused element (the trigger card)
    previouslyFocused.current = document.activeElement as HTMLElement;

    // Focus the sheet container
    const focusTimeout = setTimeout(() => {
      sheetRef.current?.focus();
    }, 100);

    // Focus trap handler
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener("keydown", handleTabKey);
      // PWS-9: Restore focus to trigger
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  // PWS-8: ESC to close (A11Y-1)
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // PWS-8: Swipe-down to dismiss (A11Y-2)
  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        onClose();
      }
    },
    [onClose]
  );

  // PWS-5: Blur heuristic — iOS gets blur, Android gets solid color
  const useBlur = isIOSSafari() && !reducedMotion; // PWS-6: reduced-motion disables blur
  const ios = isIOSSafari();

  return (
    <AnimatePresence>
      {isOpen && drink && (
        <>
          {/* PWS-4: Backdrop — blur only behind modal (PWS-5: solid on Android) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} // PWS-8: backdrop click dismisses (A11Y-3)
            className="fixed inset-0 z-[200]"
            style={{
              backgroundColor: useBlur ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.5)",
              backdropFilter: useBlur ? "blur(8px)" : "none",
              WebkitBackdropFilter: useBlur ? "blur(8px)" : "none",
              overscrollBehavior: "contain", // PWS-7
              touchAction: "none", // PWS-7
            }}
          />

          {/* Bottom Sheet — PWS-3 spring animation */}
          <motion.div
            ref={sheetRef}
            role="dialog" // PWS-10
            aria-modal="true" // PWS-10
            aria-label={drink.name} // PWS-10
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 w-full z-[201] rounded-t-[2rem] overflow-hidden max-h-[90dvh] flex flex-col"
            style={{
              // PWS-13: Atmosphere colors as CSS custom properties
              ["--atmosphere-primary" as string]: drink.atmosphere.colorPrimary,
              ["--atmosphere-secondary" as string]: drink.atmosphere.colorSecondary,
              background: `linear-gradient(180deg, ${drink.atmosphere.colorPrimary}22 0%, #ffffff 40%)`,
              boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-brand-navy/20" />
            </div>

            {/* Close button (PWS-8) */}
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/80 flex items-center justify-center text-brand-navy z-10"
              style={{ minHeight: 44, minWidth: 44 }} // FOOT-3 / A11Y-8
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto scrollbar-none px-6 pb-8 pt-2">
              {/* PWS-14/15/16: CSS particle decorations — only when motion allowed */}
              {!reducedMotion && (
                <SheetParticles drink={drink} />
              )}

              {/* Drink image (PWS-11) */}
              <div
                className="relative w-full aspect-[4/3] max-w-[280px] mx-auto rounded-[1.5rem] overflow-hidden border border-white/60 shadow-lg mb-6 mt-4"
              >
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  sizes="(max-width: 767px) 300px"
                  className="object-cover"
                />
              </div>

              {/* Drink name + world (PWS-11) */}
              <div className="text-center mb-5">
                <span className={`text-xs font-black tracking-wider ${drink.textColorClass} uppercase block mb-1`}>
                  {drink.tagline}
                </span>
                <h3 className="text-2xl font-black text-brand-navy tracking-tight uppercase mb-1">
                  {drink.name}
                </h3>
                <span className="text-sm font-bold text-brand-slate">
                  {drink.world}
                </span>
              </div>

              {/* Description (PWS-11) */}
              <p className="text-sm font-semibold text-brand-slate leading-relaxed text-center mb-5">
                {drink.description}
              </p>

              {/* Info grid (PWS-11) */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/60 rounded-2xl p-3 border border-white/60">
                  <span className="text-[8px] font-black text-brand-navy/50 uppercase tracking-wider block">
                    MALZEMELER
                  </span>
                  <span className="text-[10px] font-bold text-brand-navy block mt-1 leading-relaxed">
                    {drink.ingredients.join(" • ")}
                  </span>
                </div>
                <div className="bg-white/60 rounded-2xl p-3 border border-white/60">
                  <span className="text-[8px] font-black text-brand-navy/50 uppercase tracking-wider block">
                    RUH HALİ
                  </span>
                  <span className={`text-[10px] font-black ${drink.textColorClass} block mt-1`}>
                    {drink.mood}
                  </span>
                </div>
              </div>

              {/* Flavor notes (PWS-11) */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {drink.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="text-[9px] font-black tracking-wider px-3 py-1.5 rounded-full bg-white/60 border border-white/60 text-brand-navy uppercase"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* CTA (PWS-11) */}
              <button
                className="w-full py-4 rounded-full text-white font-black text-xs tracking-widest uppercase min-h-[44px]"
                style={{ backgroundColor: drink.accentColor }}
              >
                BUGÜN BUNU DENE
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHEET PARTICLES — CSS-keyframe DOM elements (PWS-14/15/16)
   Never canvas, never WebGL. Hard-capped at 10.
   ═══════════════════════════════════════════════════════════════ */

function SheetParticles({ drink }: { drink: Drink }) {
  const count = Math.min(drink.atmosphere.particleCount, MAX_PARTICLES); // PWS-15
  const colors = [drink.atmosphere.colorPrimary, drink.atmosphere.colorSecondary];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37 + 15) % 90;
        const delay = (i * 0.7) % 5;
        const duration = 6 + (i % 4) * 2;
        const size = 8 + (i % 3) * 4;
        const color = colors[i % 2];

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: "-5%",
              backgroundColor: color,
              opacity: 0.4,
              animation: `sheet-particle-fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
