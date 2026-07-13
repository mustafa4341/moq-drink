"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Share2, ArrowRight, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";
import { computeMood, parseBirthDate, type MoodResult } from "@/lib/mood-algorithm";
import { type MoqDrink } from "@/lib/drinks";
import ProductVisual from "./ProductVisual";


/* ═══════════════════════════════════════════════════════════════
   MOOD FINDER — Scene 6: "Modunu Bul" Premium Experience
   
   A premium digital ritual where MOQ reads the user's energy
   and matches them with the drink that represents them today.
   
   Flow (6 stages):
     1. Form       — Name + Surname + Birthday
     2. Loading    — Cinematic energy reading (typing text)
     3. Result     — MOQ Seni Seçti + energy map + personality
     4. Rare msgs  — 5% chance special message
     5. Mini jokes — Random joke pool
   ═══════════════════════════════════════════════════════════════ */

const LOADING_MESSAGES = [
  "Doğum enerjisi bulundu.",
  "Karakter analiz ediliyor.",
  "Lezzet eşleşmesi yapılıyor.",
  "En yakın MOQ bulundu.",
];

const LOADING_INTERVAL = 1100; // ms per message

export default function MoodFinderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [step, setStep] = useState<"intro" | "form" | "loading" | "result">("intro");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<MoodResult | null>(null);

  const isMobile = useIsMobile();
  const [mobileStep, setMobileStep] = useState<"welcome" | "name" | "birthday" | "ready">("welcome");

  // Loading state tracking
  const [visibleMessages, setVisibleMessages] = useState(0);

  const handleCompute = () => {
    const parsed = parseBirthDate(birthDate);
    if (!parsed) return;

    const moodResult = computeMood(name, surname, parsed.month, parsed.day);
    setResult(moodResult);
    setStep("loading");
  };

  // ── Loading sequence with timed message reveals ──
  useEffect(() => {
    if (step !== "loading") return;

    setVisibleMessages(0);
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= LOADING_MESSAGES.length; i++) {
      timers.push(
        setTimeout(() => setVisibleMessages(i), LOADING_INTERVAL * i)
      );
    }

    // Transition to result after all messages shown + small delay
    timers.push(
      setTimeout(() => {
        setStep("result");
        if (result) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.65 },
            colors: [result.drink.color, "#ffffff", "#e58a2b"],
          });
        }
      }, LOADING_INTERVAL * LOADING_MESSAGES.length + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [step, result]);

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `MOQ Seni Seçti - ${result.drink.name}`,
        text: `Bugünün MOQ'u: ${result.drink.emoji} ${result.drink.name}! Senin MOQ'un ne?`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Sonuç kopyalandı! Sosyal medyada paylaşabilirsin.");
    }
  };

  const handleReset = () => {
    setStep("intro");
    setMobileStep("welcome");
    setResult(null);
    setVisibleMessages(0);
  };

  return (
    <section
      ref={sectionRef}
      id="mood-finder"
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-32 px-6 md:px-12 overflow-hidden scene"
    >
      {/* ── Cloud Gateway Background ──────────────────────────── */}
      {/* Left cloud formation */}
      <div className="absolute top-[10%] left-0 w-[40vw] h-[50vh] pointer-events-none">
        <div className="absolute w-[500px] h-64 rounded-full bg-radial from-brand-orange-bg/60 to-transparent blur-3xl animate-mist-drift opacity-40" />
        <div className="absolute top-20 w-[400px] h-48 rounded-full bg-radial from-brand-orange-bg/40 to-transparent blur-3xl animate-mist-drift opacity-30" style={{ animationDelay: "-6s" }} />
      </div>

      {/* Right cloud formation */}
      <div className="absolute top-[10%] right-0 w-[40vw] h-[50vh] pointer-events-none">
        <div className="absolute right-0 w-[500px] h-64 rounded-full bg-radial from-brand-orange-bg/60 to-transparent blur-3xl animate-mist-drift opacity-40" style={{ animationDelay: "-10s" }} />
        <div className="absolute right-10 top-20 w-[400px] h-48 rounded-full bg-radial from-brand-orange-bg/40 to-transparent blur-3xl animate-mist-drift opacity-30" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Dynamic background color during loading/result — drink-specific atmosphere */}
      <AnimatePresence>
        {step === "loading" && result && (
          <motion.div
            key="drink-bg-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${result.drink.color}33 0%, transparent 65%)`,
            }}
          />
        )}

        {step === "result" && result && (
          <motion.div
            key="drink-bg-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-b ${result.drink.resultTheme.bgGrad} pointer-events-none z-0`}
          >
            {/* Glowing background bubble */}
            <div 
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[90vw] h-[60vh] rounded-full blur-3xl opacity-35"
              style={{ background: `radial-gradient(circle, ${result.drink.color}45 0%, transparent 70%)` }}
            />
            
            {/* Ambient floating slices / leaves */}
            <div className="absolute inset-0 overflow-hidden opacity-30 select-none">
              {/* Floating Slice Left */}
              <div className="absolute left-[5%] top-[15%] w-24 h-24 rotate-[-15deg] animate-[float-drink_8s_ease-in-out_infinite]">
                <span className="text-6xl">{result.drink.emoji}</span>
              </div>
              
              {/* Floating Leaf Right */}
              <div className="absolute right-[8%] top-[22%] w-16 h-16 rotate-[25deg] animate-[float-drink-delayed_9s_ease-in-out_infinite]">
                <span className="text-5xl">🍃</span>
              </div>

              {/* Floating Slice Right */}
              <div className="absolute right-[5%] bottom-[25%] w-20 h-20 rotate-[45deg] animate-[float-drink_7s_ease-in-out_infinite]">
                <span className="text-5xl">{result.drink.emoji}</span>
              </div>

              {/* Floating Leaf Left */}
              <div className="absolute left-[10%] bottom-[30%] w-14 h-14 rotate-[-35deg] animate-[float-drink-delayed_10s_ease-in-out_infinite]">
                <span className="text-4xl">🍃</span>
              </div>
            </div>

            {/* Dynamic CSS-keyframe particles matching the JSON theme config */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              {[...Array(result.drink.resultTheme.particleType === "bubbles" ? 15 : 10)].map((_, i) => {
                const delay = i * 0.7;
                const left = 5 + (i * 17) % 90;
                const duration = 6 + (i % 4) * 2.5;
                const size = result.drink.resultTheme.particleType === "bubbles" 
                  ? (6 + (i % 3) * 4) 
                  : (14 + (i % 3) * 6);

                return (
                  <div
                    key={i}
                    className="absolute rounded-full opacity-40"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}%`,
                      bottom: `-5%`,
                      backgroundColor: result.drink.resultTheme.particleColor,
                      boxShadow: `0 0 10px ${result.drink.glowColor}30`,
                      animation: `sheet-particle-fall ${duration}s linear infinite`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center light column */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[70vh] pointer-events-none opacity-20"
        style={{
          background: "linear-gradient(to bottom, rgba(56,139,230,0.3) 0%, rgba(229,138,43,0.2) 50%, rgba(255,255,255,0.1) 100%)",
          filter: "blur(40px)",
        }}
      />

      {/* Golden Hour light rays */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 30%, rgba(229,138,43,0.4) 0%, transparent 60%)" }}
      />

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="max-w-[1280px] w-full flex flex-col items-center space-y-12 relative z-10">
        {/* Header (Hidden in Result Step) */}
        {step !== "result" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center space-y-3 text-center"
          >
            <span className="type-label text-brand-orange-text">
              GERÇEK TAT, GERÇEK SEN.
            </span>
            <h2 className="type-scene-title text-brand-navy font-sans">
              MOQ'UNU BUL
            </h2>
            <p className="type-body text-brand-slate max-w-xl">
              Belki enerjin Merida kadar canlıdır. Belki de Sunset kadar sakindir. Bunu öğrenmenin tek yolu var. İsmini bırak. Doğum tarihini ekle. Gerisini MOQ merak etsin.
            </p>
          </motion.div>
        )}

        {/* Result Header (Visible only in Result Step) */}
        {step === "result" && result && (
          <div className="flex flex-col items-center space-y-4 text-center w-full max-w-lg z-10">
            {/* MOQ Logo */}
            <div className="relative w-16 h-8 md:w-20 md:h-10">
              <Image
                src="/images/logo_v3.png"
                alt="MOQ Logo"
                fill
                className="object-contain brightness-0"
              />
            </div>
            
            {/* Title & Subtitle */}
            <div className="flex flex-col items-center space-y-1">
              <span className="text-[10px] font-black text-brand-slate tracking-[0.25em] uppercase">
                BUGÜNKÜ ENERJİN
              </span>
              <h1 
                className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none"
                style={{ color: result.drink.color }}
              >
                {result.drink.name}
              </h1>
              <span 
                className="font-serif italic font-medium tracking-wide text-base md:text-lg mt-2 block"
                style={{ color: result.drink.color }}
              >
                {result.drink.resultTheme.tagline}
              </span>
            </div>

            {/* Giant Glowing Core Symbol */}
            <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center mt-3">
              {/* Outer pulsing rings */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-15 pointer-events-none"
                style={{ backgroundColor: result.drink.color }}
              />
              <div 
                className="absolute inset-4 rounded-full border-2 opacity-35 pointer-events-none"
                style={{ borderColor: result.drink.color, animation: "rotate-slow 10s linear infinite" }}
              />
              <div 
                className="absolute inset-8 rounded-full border opacity-20 pointer-events-none"
                style={{ borderColor: result.drink.color, animation: "rotate-reverse 15s linear infinite" }}
              />
              
              {/* Inner glowing circle - replaced with ProductVisual for image compatibility */}
              <div className="relative z-10 w-24 h-24 flex items-center justify-center scale-95 md:scale-100">
                <ProductVisual
                  image={result.drink.image}
                  name={result.drink.name}
                  emoji={result.drink.emoji}
                  colors={result.drink.colors}
                  size="sm"
                  className="rounded-full shadow-2xl border-2 border-white/60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Glass Portal (only for Form/Loading/Intro) */}
        {step !== "result" && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg glass border border-white/95 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(229,138,43,0.06)] relative overflow-hidden flex flex-col items-center min-h-[460px]"
          >
            <AnimatePresence mode="wait">
              {step === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col items-center justify-center space-y-8 py-8"
                >
                  <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-brand-orange-bg/40 border border-white/50 shadow-inner">
                    <Sparkles className="w-10 h-10 text-brand-orange-text animate-pulse" />
                  </div>
                  
                  <p className="text-xs font-semibold text-brand-slate leading-relaxed text-center max-w-sm">
                    MOQ ile frekansını eşitlemeye hazır mısın? Bilgilerini gir, bugünkü enerjine en uygun MOQ lezzetini ve hayat elementini bul.
                  </p>

                  <div className="w-full pt-2">
                    <Magnetic range={30} strength={0.35} className="w-full block">
                      <button
                        onClick={() => {
                          setStep("form");
                          setMobileStep("name"); // Skip welcome step on mobile
                        }}
                        data-cursor="START"
                        className="w-full group flex items-center justify-center space-x-2 bg-brand-orange-text text-white font-black text-xs tracking-widest py-4.5 rounded-full shadow-[0_5px_15px_rgba(229,138,43,0.2)] hover:shadow-[0_10px_25px_rgba(229,138,43,0.35)] transition-all duration-[var(--duration-hover)] hover:scale-[1.02] cursor-pointer pulse-glow-moq"
                      >
                        <span>MOQ'UNU BUL</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col space-y-6 pt-2"
                >
                  <div className="block md:hidden w-full">
                    <MobileFormFlow
                      name={name}
                      surname={surname}
                      birthDate={birthDate}
                      mobileStep={mobileStep}
                      setName={setName}
                      setSurname={setSurname}
                      setBirthDate={setBirthDate}
                      setMobileStep={setMobileStep}
                      onSubmit={handleCompute}
                    />
                  </div>
                  <div className="hidden md:block w-full">
                    <DesktopForm
                      name={name}
                      surname={surname}
                      birthDate={birthDate}
                      setName={setName}
                      setSurname={setSurname}
                      setBirthDate={setBirthDate}
                      onSubmit={handleCompute}
                    />
                  </div>
                </motion.div>
              )}

              {step === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center justify-center space-y-8 py-8"
                >
                  <div className="moq-breathe relative">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
                      style={{
                        background: result
                          ? `linear-gradient(135deg, ${result.drink.color}40, ${result.drink.color}10)`
                          : "rgba(229,138,43,0.1)",
                        boxShadow: result
                          ? `0 0 40px ${result.drink.color}40`
                          : "0 0 30px rgba(229,138,43,0.2)",
                      }}
                    >
                      <Sparkles className="w-8 h-8 text-brand-orange-text" />
                    </div>
                    <div
                      className="absolute -inset-4 rounded-full opacity-30 pointer-events-none"
                      style={{
                        background: result
                          ? `conic-gradient(from 0deg, transparent, ${result.drink.color}40, transparent)`
                          : "transparent",
                        animation: "rotate-slow 4s linear infinite",
                      }}
                    />
                  </div>

                  <div className="flex flex-col space-y-2.5 items-start min-h-[140px] w-full max-w-xs">
                    {LOADING_MESSAGES.slice(0, visibleMessages).map((msg) => (
                      <motion.div
                        key={msg}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center space-x-2.5"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: result?.drink.color || "#e58a2b" }}
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-xs font-bold text-brand-navy">{msg}</span>
                      </motion.div>
                    ))}
                    {visibleMessages < LOADING_MESSAGES.length && (
                      <div className="flex items-center space-x-2.5 opacity-50">
                        <div className="w-5 h-5 rounded-full border-2 border-brand-orange-text/40 animate-pulse" />
                        <span className="text-xs font-bold text-brand-slate">...</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-brand-slate font-bold tracking-wider uppercase">
                    MOQ enerjin okunuyor...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Result Screen (staggered stack outside the main card wrapper, matching the mockup layout) */}
        {step === "result" && result && (
          <ResultCard result={result} onShare={handleShare} onReset={handleReset} />
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP FORM — Single form, premium inputs
   ═══════════════════════════════════════════════════════════════ */

function DesktopForm({
  name, surname, birthDate,
  setName, setSurname, setBirthDate, onSubmit,
}: {
  name: string;
  surname: string;
  birthDate: string;
  setName: (v: string) => void;
  setSurname: (v: string) => void;
  setBirthDate: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col space-y-5">
      <div className="flex flex-col space-y-2">
        <label htmlFor="ad" className="type-label text-brand-navy">AD</label>
        <input
          id="ad"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız"
          className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy placeholder:text-brand-slate/50 focus:outline-none transition-all font-bold"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="soyad" className="type-label text-brand-navy">SOYAD</label>
        <input
          id="soyad"
          type="text"
          required
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Soyadınız"
          className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy placeholder:text-brand-slate/50 focus:outline-none transition-all font-bold"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="dob" className="type-label text-brand-navy">DOĞUM TARİHİ</label>
        <input
          id="dob"
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy focus:outline-none transition-all font-bold"
        />
      </div>
      <div className="pt-3">
        <Magnetic range={30} strength={0.35} className="w-full block">
          <button
            type="submit"
            className="w-full group flex items-center justify-center space-x-2 bg-brand-orange-text text-white font-black text-xs tracking-widest py-4.5 rounded-full shadow-[0_5px_15px_rgba(229,138,43,0.2)] hover:shadow-[0_10px_25px_rgba(229,138,43,0.35)] transition-all duration-[var(--duration-hover)] hover:scale-[1.02] cursor-pointer pulse-glow-moq"
          >
            <span>MOQ'UNU BUL</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE FORM FLOW — 4 step wizard
   ═══════════════════════════════════════════════════════════════ */

function MobileFormFlow({
  name, surname, birthDate, mobileStep,
  setName, setSurname, setBirthDate, setMobileStep, onSubmit,
}: {
  name: string;
  surname: string;
  birthDate: string;
  mobileStep: "welcome" | "name" | "birthday" | "ready";
  setName: (v: string) => void;
  setSurname: (v: string) => void;
  setBirthDate: (v: string) => void;
  setMobileStep: (s: "welcome" | "name" | "birthday" | "ready") => void;
  onSubmit: () => void;
}) {
  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Welcome Step */}
      {mobileStep === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-full bg-brand-orange-bg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-orange-text animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-brand-slate leading-relaxed">
            MOQ ile frekansını eşitlemeye hazır mısın? Bilgilerini gir, bugünkü enerjine en uygun MOQ lezzetini ve hayat elementini bul.
          </p>
          <button
            onClick={() => setMobileStep("name")}
            className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md"
          >
            BAŞLA
          </button>
        </motion.div>
      )}

      {/* Name Step */}
      {mobileStep === "name" && (
        <motion.div
          key="name"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-5"
        >
          <div className="flex flex-col space-y-2">
            <label className="type-label text-brand-navy">ADINIZ</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız"
              className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy placeholder:text-brand-slate/50 focus:outline-none transition-all font-bold"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="type-label text-brand-navy">SOYADINIZ</label>
            <input
              type="text"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Soyadınız"
              className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy placeholder:text-brand-slate/50 focus:outline-none transition-all font-bold"
            />
          </div>
          <button
            disabled={!name.trim() || !surname.trim()}
            onClick={() => setMobileStep("birthday")}
            className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md disabled:opacity-50"
          >
            DEVAM
          </button>
        </motion.div>
      )}

      {/* Birthday Step */}
      {mobileStep === "birthday" && (
        <motion.div
          key="birthday"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-5"
        >
          <div className="flex flex-col space-y-2">
            <label className="type-label text-brand-navy">DOĞUM TARİHİ</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy focus:outline-none transition-all font-bold"
            />
          </div>
          <button
            disabled={!birthDate}
            onClick={() => setMobileStep("ready")}
            className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md disabled:opacity-50"
          >
            DEVAM
          </button>
        </motion.div>
      )}

      {/* Ready Step */}
      {mobileStep === "ready" && (
        <motion.div
          key="ready"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-full bg-brand-orange-bg flex items-center justify-center animate-bounce">
            <Sparkles className="w-6 h-6 text-brand-orange-text" />
          </div>
          <h4 className="text-lg font-black text-brand-navy tracking-tight uppercase">HAZIR MISIN?</h4>
          <p className="text-xs font-semibold text-brand-slate leading-relaxed">
            Tüm bilgiler hazır! Evrensel frekansını analiz edip MOQ sonucunu görmeye hazır mısın?
          </p>
          <button
            onClick={onSubmit}
            className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md animate-pulse"
          >
            MOQ'UNU BUL
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESULT CARD — "MOQ Seni Seçti" + Energy Map + Personality
   ═══════════════════════════════════════════════════════════════ */

function ResultCard({
  result,
  onShare,
  onReset,
}: {
  result: MoodResult;
  onShare: () => void;
  onReset: () => void;
}) {
  const { drink, personalityIndex, energy, showRareMessage, rareMessage, miniJoke } = result;
  const personalityText = drink.personalities[personalityIndex] || drink.personalities[0];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-lg flex flex-col space-y-6 text-center"
    >
      {/* ── CARD 1: ENERJİ HARİTAN ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white/95 border border-white/80 rounded-[2rem] p-6 shadow-md text-left space-y-4"
      >
        <span className="text-[10px] font-black text-brand-navy/60 block text-center uppercase tracking-widest relative">
          <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-brand-navy/10 z-0" />
          <span className="bg-white/95 px-4 relative z-10">ENERJİ HARİTAN</span>
        </span>
        
        <div className="space-y-4">
          <EnergyBar emoji="❤️" label="CESARET" subtext="İçindeki kıvılcım" value={energy.cesaret} color="#e04f75" delay={0.3} />
          <EnergyBar emoji="🌿" label="DİNGİNLİK" subtext="Zihninin nefesi" value={energy.dinginlik} color="#73b83e" delay={0.45} />
          <EnergyBar emoji="☀️" label="NEŞE" subtext="Ruhunun ışıltısı" value={energy.nese} color="#f0a030" delay={0.6} />
          <EnergyBar emoji="🌊" label="FERAHLIK" subtext="İçindeki serinlik" value={energy.ferahlık} color="#388be6" delay={0.75} />
        </div>
      </motion.div>

      {/* ── CARD 2: PERSONALITY + IMAGE ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white/40 border border-white/60 rounded-[2.5rem] p-6 md:p-8 flex items-center justify-between shadow-[0_15px_40px_rgba(229,138,43,0.03)] text-left relative overflow-hidden backdrop-blur-md"
      >
        {/* Left Side: Quote + Text */}
        <div className="flex flex-col space-y-3 z-10 max-w-[60%]">
          <span className="text-6xl font-serif font-black leading-none opacity-20 -mb-4 select-none" style={{ color: drink.color }}>
            “
          </span>
          <p className="text-xs font-semibold text-brand-navy leading-relaxed whitespace-pre-line">
            {personalityText}
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-black text-brand-slate uppercase tracking-wider block">Bugünkü MOQ'un</span>
            <span className="text-2xl font-black uppercase tracking-tight block mt-1" style={{ color: drink.color }}>
              {drink.name}.
            </span>
          </div>
        </div>

        {/* Right Side: Floating Cup Image */}
        <div className="relative w-[130px] h-[210px] flex-shrink-0 z-10 flex items-center justify-center">
          <div 
            className="absolute w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none z-0"
            style={{ backgroundColor: drink.color }}
          />
          <Image
            src={drink.image}
            alt={drink.name}
            width={120}
            height={200}
            className="object-contain animate-float-medium relative z-10"
            priority
          />
        </div>
      </motion.div>

      {/* ── CARD 3: JOKE BOX ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-white/60 border border-white/50 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl flex-shrink-0">{drink.resultTheme.jokeEmoji}</span>
          <p className="text-[11px] font-medium text-brand-navy leading-relaxed">
            {drink.resultTheme.jokeNormal}
            <span className="font-bold" style={{ color: drink.color }}>
              {drink.resultTheme.jokeBold}
            </span>
          </p>
        </div>
        <span className="text-lg opacity-40 flex-shrink-0" style={{ color: drink.color }}>
          {drink.resultTheme.coreSymbol}
        </span>
      </motion.div>

      {/* ── CARD 4 & 5: DETAILS GRID (DÜNYA & İÇİNDEKİLER) ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full grid grid-cols-2 gap-4 text-left"
      >
        {/* Card 4: DÜNYA */}
        <div className="bg-white/45 border border-white/50 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden backdrop-blur-sm">
          <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 opacity-[0.06] pointer-events-none select-none z-0 text-brand-navy">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M10,90 C30,70 60,60 90,50 C75,55 60,65 50,80 C45,70 30,65 10,90 Z" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-1.5 z-10">
            <Sparkles className="w-3 h-3" style={{ color: drink.color }} />
            <span className="text-[8px] font-black text-brand-navy/60 uppercase tracking-wider">
              DÜNYA
            </span>
          </div>
          <div className="mt-4 z-10">
            <span 
              className="text-2xl font-serif italic font-medium tracking-wide block animate-pulse"
              style={{ color: drink.color }}
            >
              {drink.worldName}
            </span>
            <span className="text-[9px] font-semibold text-brand-slate block mt-1">
              {drink.resultTheme.worldSubtext}
            </span>
          </div>
        </div>

        {/* Card 5: İÇİNDEKİLER */}
        <div className="bg-white/45 border border-white/50 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] relative overflow-hidden backdrop-blur-sm">
          <div className="absolute right-[-10px] bottom-[-10px] w-16 h-16 opacity-[0.06] pointer-events-none select-none z-0 text-brand-navy">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="none" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="6" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="6" />
            </svg>
          </div>

          <div className="flex items-center space-x-1.5 z-10">
            <Check className="w-3 h-3" style={{ color: drink.color }} />
            <span className="text-[8px] font-black text-brand-navy/60 uppercase tracking-wider">
              İÇİNDEKİLER
            </span>
          </div>
          <div className="mt-4 z-10">
            <span className="text-[10px] font-bold text-brand-navy block leading-relaxed line-clamp-2">
              {drink.ingredients.join(" • ")}
            </span>
            <span className="text-[9px] font-semibold text-brand-slate block mt-1">
              {drink.resultTheme.ingredientsSubtext}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── RARE MESSAGE (5% chance) ── */}
      {showRareMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="w-full rounded-2xl p-4 border text-left"
          style={{
            background: `${drink.color}15`,
            borderColor: `${drink.color}40`,
          }}
        >
          <p className={`text-[11px] font-bold leading-relaxed whitespace-pre-line ${drink.textColor}`}>
            {rareMessage}
          </p>
        </motion.div>
      )}

      {/* ── CTA BUTTONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="w-full grid grid-cols-3 gap-3 pt-2"
      >
        <Magnetic range={25} strength={0.3} className="w-full block">
          <button
            className="w-full flex items-center justify-center space-x-1.5 text-white font-black text-[10px] tracking-widest py-4 rounded-full shadow-lg hover:brightness-95 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: drink.color }}
          >
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            <span>DENE</span>
          </button>
        </Magnetic>

        <Magnetic range={25} strength={0.3} className="w-full block">
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center space-x-1.5 bg-brand-navy text-white font-black text-[10px] tracking-widest py-4 rounded-full shadow-lg hover:bg-brand-blue-text transition-all duration-300 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>PAYLAŞ</span>
          </button>
        </Magnetic>

        <Magnetic range={25} strength={0.3} className="w-full block">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-1.5 bg-white/80 hover:bg-white text-brand-navy font-black text-[10px] tracking-widest py-4 rounded-full border border-white shadow-sm transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TEKRAR</span>
          </button>
        </Magnetic>
      </motion.div>

      {/* ── FOOTER QUOTE ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-[10px] text-brand-slate font-medium pt-3 animate-pulse"
      >
        {miniJoke}
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENERGY BAR — Animated fill bar for energy map
   ═══════════════════════════════════════════════════════════════ */

function EnergyBar({
  emoji,
  label,
  subtext,
  value,
  color,
  delay,
}: {
  emoji: string;
  label: string;
  subtext: string;
  value: number;
  color: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.2;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * (progress * (2 - progress)));
      setCount(current);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [inView, value]);

  const softBg = `${color}15`;

  return (
    <div ref={ref} className="flex items-center space-x-3 w-full">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ backgroundColor: softBg }}
      >
        {emoji}
      </div>

      <div className="flex flex-col flex-shrink-0 w-24">
        <span className="text-[9px] font-black text-brand-navy tracking-wide">{label}</span>
        <span className="text-[8px] font-semibold text-brand-slate/85 mt-0.5 leading-none">{subtext}</span>
      </div>

      <div className="flex-grow h-2.5 bg-brand-slate/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <span className="text-[10px] font-black w-8 text-right flex-shrink-0" style={{ color }}>
        %{count}
      </span>
    </div>
  );
}
