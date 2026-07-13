"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import type { Drink } from "@/lib/product-data";
import ProductVisual from "./ProductVisual";

/* ═══════════════════════════════════════════════════════════════
   BOTTOM SHEET — Premium Shared mobile-exclusive popup
   ═══════════════════════════════════════════════════════════════ */

interface BottomSheetProps {
  drink: Drink | null;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_PARTICLES = 10;

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

function isIOSSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  return iOS && webkit && !/CriOS|FxiOS/.test(ua);
}

export default function BottomSheet({ drink, isOpen, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Mobile optimization: Body scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // A11y & Focus trap
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;
    previouslyFocused.current = document.activeElement as HTMLElement;

    const focusTimeout = setTimeout(() => {
      sheetRef.current?.focus();
    }, 100);

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
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Swipe-down dismiss gesture
  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 120 || info.velocity.y > 600) {
        onClose();
      }
    },
    [onClose]
  );

  const useBlur = isIOSSafari() && !reducedMotion;

  return (
    <AnimatePresence>
      {isOpen && drink && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] select-none"
            style={{
              backgroundColor: useBlur ? "rgba(26, 37, 60, 0.45)" : "rgba(26, 37, 60, 0.65)",
              backdropFilter: useBlur ? "blur(12px)" : "none",
              WebkitBackdropFilter: useBlur ? "blur(12px)" : "none",
              overscrollBehavior: "contain",
              touchAction: "none",
            }}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={drink.name}
            tabIndex={-1}
            initial={reducedMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={reducedMotion ? { duration: 0.25 } : { type: "spring", stiffness: 350, damping: 32 }}
            drag={reducedMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 w-full z-[201] rounded-t-[2.5rem] overflow-hidden max-h-[92dvh] flex flex-col overflow-y-hidden"
            style={{
              transition: "background-color 400ms ease-out",
              background: `linear-gradient(180deg, ${drink.colors.background} 0%, #ffffff 35%)`,
              boxShadow: "0 -12px 42px rgba(26, 37, 60, 0.15)",
              contain: "paint",
            }}
          >
            {/* ── 3. Background Transition & Decorative Effects ── */}
            {!reducedMotion && <BottomSheetDecorations drink={drink} />}

            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 z-10 relative">
              <div className="w-10 h-1.5 rounded-full bg-brand-navy/15" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 flex items-center justify-center text-brand-navy z-30 transition-transform active:scale-95"
              style={{ minHeight: 44, minWidth: 44 }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto scrollbar-none px-6 pb-10 pt-4 z-10 relative flex flex-col space-y-6">
              
              {/* World Name Typo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <span className="text-[12vw] font-black uppercase text-brand-navy opacity-[0.03] tracking-tighter whitespace-nowrap">
                  {drink.worldName}
                </span>
              </div>

              {/* ── 4. Drink Visual Illustration ── */}
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: 30 }}
                animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center z-[2]"
              >
                <ProductVisual
                  image={drink.image}
                  name={drink.name}
                  emoji={drink.emoji}
                  colors={drink.colors}
                  size="lg"
                  className="rounded-[2rem]"
                />
              </motion.div>

              {/* ── 5. Titles (Slide + Fade) ── */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-center z-[2]"
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-slate opacity-75 block mb-1">
                  🌍 {drink.worldName}
                </span>
                <h3 className="text-3xl font-black text-brand-navy tracking-tight uppercase">
                  {drink.shortTitle}
                </h3>
                <span className={`text-[10px] font-extrabold tracking-widest ${drink.textColorClass} block mt-0.5 uppercase`}>
                  {drink.subtitle}
                </span>
              </motion.div>

              {/* Divider */}
              <div className="h-[1px] bg-brand-navy/5 w-1/3 mx-auto" />

              {/* ── 6. Story ── */}
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-sm font-semibold text-brand-slate leading-relaxed text-center max-w-sm mx-auto z-[2]"
              >
                {drink.story}
              </motion.p>

              {/* Divider */}
              <div className="h-[1px] bg-brand-navy/5 w-1/3 mx-auto" />

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 w-full z-[2]">
                
                {/* ── 7. Ingredients (Staggered Entry) ── */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-[0_4px_12px_rgba(26,37,60,0.02)]"
                >
                  <span className="text-[9px] font-black text-brand-navy/50 uppercase tracking-wider block mb-2 text-center">
                    MALZEMELER
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {drink.ingredients.map((ing, idx) => (
                      <motion.span
                        key={ing}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        className="text-[9px] font-bold text-brand-navy bg-white/70 px-2 py-0.5 rounded-lg border border-white/40"
                      >
                        {ing}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* ── 8. Mood Tags (Glowing Effect) ── */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-[0_4px_12px_rgba(26,37,60,0.02)]"
                >
                  <span className="text-[9px] font-black text-brand-navy/50 uppercase tracking-wider block mb-2 text-center">
                    RUH HALİ
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {drink.moods.map((mood, idx) => (
                      <motion.span
                        key={mood}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + idx * 0.05 }}
                        className="text-[9px] font-black px-2 py-0.5 rounded-lg border bg-white/80 border-white/40 shadow-sm"
                        style={{
                          color: drink.colors.primary,
                          borderColor: `${drink.colors.primary}25`,
                          boxShadow: `0 0 10px ${drink.colors.primary}15`,
                        }}
                      >
                        {mood}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* Taste Notes Tag Wrapper */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="flex flex-wrap gap-1.5 justify-center z-[2]"
              >
                {drink.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="text-[9px] font-black tracking-wider px-3 py-1.5 rounded-full bg-white/60 border border-white/60 text-brand-navy uppercase shadow-sm"
                  >
                    {note}
                  </span>
                ))}
              </motion.div>

              {/* MOQ Message and CTA button removed for cleaner mobile layout */}
            </div>

            {/* Injected animations */}
            <style jsx global>{`
              @keyframes cta-breathing {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.025); }
              }
              @keyframes sheet-particle-fall {
                0% { transform: translateY(-5%) rotate(0deg); opacity: 0; }
                10% { opacity: 0.4; }
                90% { opacity: 0.4; }
                100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DECORATIVE LAYER GENERATOR (Specific world decorations)
   ═══════════════════════════════════════════════════════════════ */

function BottomSheetDecorations({ drink }: { drink: Drink }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      
      {/* 1. Mist/Glow backdrop effects based on background configuration */}
      {drink.theme.bgEffects.includes("green-mist") && (
        <div className="absolute top-0 left-[-20%] w-[140%] h-[35%] bg-gradient-to-b from-[#7CCB45]/20 to-transparent blur-3xl rounded-full" />
      )}
      {drink.theme.bgEffects.includes("red-glow") && (
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[40%] bg-radial-gradient from-[#E63946]/15 to-transparent blur-3xl rounded-full" />
      )}
      {drink.theme.bgEffects.includes("orange-gradient") && (
        <div className="absolute top-0 right-[-10%] w-[80%] h-[45%] bg-gradient-to-bl from-[#FF9F1A]/20 via-[#FFE3BA]/10 to-transparent blur-3xl rounded-full" />
      )}
      {drink.theme.bgEffects.includes("sunshine-rays") && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/15 via-transparent to-transparent opacity-60" />
      )}
      {drink.theme.bgEffects.includes("sunset-cove") && (
        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#FF6B35]/15 to-transparent opacity-80" />
      )}
            {/* 2. Vector Canvas Particles instead of falling emojis */}
      <BottomSheetParticles key={drink.id} drinkId={drink.id} color={drink.colors.primary} />

      {/* 3. Aesthetic overlays (e.g. glass reflections, vignette overlays) */}
      {drink.theme.bgEffects.includes("glass-reflection") && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      )}
      {drink.theme.bgEffects.includes("vignette") && (
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(26,37,60,0.06)] pointer-events-none" />
      )}
    </div>
  );
}

function BottomSheetParticles({ drinkId, color }: { drinkId: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      r: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotSpeed: number;
    }[] = [];

    // 10 particles for mobile bottom sheet (lightweight and GPU friendly)
    const count = 10;

    const resize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 3,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 0.8 - 0.4,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.rotation * 0.008) * 0.15;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;

        // Custom drawing paths matching the drink themes
        if (drinkId === "cool-lime") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.7, p.r * 1.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (drinkId === "limonata") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 0.8, false);
          ctx.stroke();
        } else if (drinkId === "merida") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.1, 0, Math.PI, false);
          ctx.arc(0, 0, p.r * 0.5, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "redline") {
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.4);
          ctx.quadraticCurveTo(p.r * 0.8, 0, 0, p.r);
          ctx.quadraticCurveTo(-p.r * 0.8, 0, 0, -p.r * 1.4);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "sundrop") {
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.3);
          ctx.quadraticCurveTo(0, 0, p.r * 1.3, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.r * 1.3);
          ctx.quadraticCurveTo(0, 0, -p.r * 1.3, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.r * 1.3);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "sunset") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (drinkId === "churchill") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.stroke();
        } else if (drinkId === "portakal-suyu") {
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.3);
          ctx.bezierCurveTo(p.r, -p.r * 0.5, p.r, p.r, 0, p.r * 1.2);
          ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r * 0.5, 0, -p.r * 1.3);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start rendering loop immediately on mount
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [drinkId, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] gpu-layer"
    />
  );
}
