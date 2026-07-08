"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC LOADING — Scene 0
   QR → White → Clouds → Logo → Camera enters clouds → Island → Hero
   
   5-stage sequence (3000ms total, each stage ~600ms):
     0 (0–600ms):    White screen, soft noise grain
     1 (600–1200ms):  Cloud layers fade in from edges
     2 (1200–2000ms): MOQ logo materializes in center
     3 (2000–2600ms): Camera "zooms" forward — clouds rush outward, logo scales up and fades
     4 (2600–3200ms): Cross-dissolve into Hero scene
   ═══════════════════════════════════════════════════════════════ */

interface CinematicLoadingProps {
  onComplete: () => void;
}

export default function CinematicLoading({ onComplete }: CinematicLoadingProps) {
  const [stage, setStage] = useState(0);
  // Keep latest onComplete in a ref so the timed effect never re-runs
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const finishedRef = useRef(false);

  useEffect(() => {
    // Stage 1: Clouds begin forming
    const cloudTimer = setTimeout(() => setStage(1), 600);

    // Stage 2: Logo materializes
    const logoTimer = setTimeout(() => setStage(2), 1200);

    // Stage 3: Camera zooms forward — entering the world
    const zoomTimer = setTimeout(() => setStage(3), 2000);

    // Stage 4: Complete — cross-dissolve to Hero
    const complete = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setStage(4);
      onCompleteRef.current();
    };
    const completeTimer = setTimeout(complete, 2800);

    // Safety net: guarantee completion even if timers drift
    const safetyTimer = setTimeout(complete, 4000);

    return () => {
      clearTimeout(cloudTimer);
      clearTimeout(logoTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 w-full h-full z-[9999] flex flex-col justify-center items-center overflow-hidden select-none"
          style={{ background: "#ffffff" }}
        >
          {/* ── Noise Grain Overlay ──────────────────────────── */}
          <div
            className="noise-overlay"
            style={{ opacity: stage < 2 ? 0.04 : 0.02 }}
          />

          {/* ── Cloud Layer System ──────────────────────────── */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Cloud Left */}
            <motion.div
              initial={{ x: "-30%", y: "-10%", scale: 0.8, opacity: 0 }}
              animate={
                stage === 3
                  ? { x: "-120%", y: "-40%", scale: 3, opacity: 0 }
                  : stage >= 1
                  ? { x: "0%", y: "0%", scale: 1.1, opacity: 0.85 }
                  : { x: "-30%", y: "-10%", scale: 0.8, opacity: 0 }
              }
              transition={{
                duration: stage === 3 ? 0.8 : 1.2,
                ease: stage === 3 ? "easeIn" : [0.16, 1, 0.3, 1],
              }}
              className="absolute top-1/4 left-0 w-[420px] h-72 bg-radial from-sky-100/50 to-transparent blur-3xl"
            />

            {/* Cloud Right */}
            <motion.div
              initial={{ x: "30%", y: "15%", scale: 0.8, opacity: 0 }}
              animate={
                stage === 3
                  ? { x: "120%", y: "40%", scale: 3, opacity: 0 }
                  : stage >= 1
                  ? { x: "0%", y: "0%", scale: 1.1, opacity: 0.85 }
                  : { x: "30%", y: "15%", scale: 0.8, opacity: 0 }
              }
              transition={{
                duration: stage === 3 ? 0.8 : 1.2,
                ease: stage === 3 ? "easeIn" : [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="absolute bottom-1/4 right-0 w-[500px] h-80 bg-radial from-sky-100/40 to-transparent blur-3xl"
            />

            {/* Cloud Top */}
            <motion.div
              initial={{ x: "0%", y: "-20%", scale: 0.8, opacity: 0 }}
              animate={
                stage === 3
                  ? { y: "-80%", scale: 3, opacity: 0 }
                  : stage >= 1
                  ? { x: "0%", y: "0%", scale: 1, opacity: 0.6 }
                  : { x: "0%", y: "-20%", scale: 0.8, opacity: 0 }
              }
              transition={{
                duration: stage === 3 ? 0.7 : 1.0,
                ease: stage === 3 ? "easeIn" : [0.16, 1, 0.3, 1],
                delay: 0.15,
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-radial from-white/70 to-transparent blur-3xl"
            />

            {/* Cloud Center Glow */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={
                stage === 3
                  ? { scale: 4, opacity: 1 }
                  : stage >= 1
                  ? { scale: 1.2, opacity: 0.6 }
                  : { scale: 0.6, opacity: 0 }
              }
              transition={{
                duration: stage === 3 ? 0.8 : 1.5,
                ease: stage === 3 ? "easeIn" : "easeOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-radial from-brand-blue-bg/40 via-white to-transparent blur-2xl"
            />
          </div>

          {/* ── MOQ Logo ─────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <AnimatePresence>
              {stage === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-[180px] h-[90px] md:w-[240px] md:h-[120px]"
                >
                  <Image
                    src="/images/logo_v3.png"
                    alt="MOQ Logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Light Flare (Stage 3 — entering the world) ──── */}
          {stage === 3 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 5, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              className="absolute w-72 h-72 rounded-full bg-radial from-brand-button via-sky-100 to-transparent blur-xl pointer-events-none z-20"
            />
          )}

          {/* ── Bottom mist line ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={stage >= 1 ? { opacity: 0.15 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
