"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Share2, ArrowRight, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";
import { computeMood, parseBirthDate, type MoodResult } from "@/lib/mood-algorithm";
import { type MoqDrink } from "@/lib/drinks";

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
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
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
    setStep("form");
    setMobileStep("welcome");
    setResult(null);
    setVisibleMessages(0);
  };

  if (isMobile === null) {
    return <section id="mood-finder" className="relative w-full min-h-[50vh] bg-[#F7FAFF]" />;
  }

  return (
    <section
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
        {(step === "loading" || step === "result") && result && (
          <motion.div
            key="drink-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: step === "loading" ? 0.35 : 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none bg-color-shift"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${result.drink.color}33 0%, transparent 65%)`,
            }}
          />
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
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <span className="type-label text-brand-orange-text">
            MOQ'UN KALBİ
          </span>
          <h2 className="type-scene-title text-brand-navy font-sans">
            MODUNU BUL
          </h2>
          <p className="type-body text-brand-slate max-w-md">
            Günü sadece yaşama, hisset. MOQ dünyasına ismini bırak ve bugünün lezzetini keşfet.
          </p>
        </div>

        {/* Center Glass Portal */}
        <div className="w-full max-w-lg glass border border-white/95 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(229,138,43,0.06)] relative overflow-hidden flex flex-col items-center min-h-[460px]">
          <AnimatePresence mode="wait">
            {/* ════════════════════════════════════════════════════
                STAGE 1 — FORM
               ════════════════════════════════════════════════════ */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col space-y-6 pt-2"
              >
                {isMobile ? (
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
                ) : (
                  <DesktopForm
                    name={name}
                    surname={surname}
                    birthDate={birthDate}
                    setName={setName}
                    setSurname={setSurname}
                    setBirthDate={setBirthDate}
                    onSubmit={handleCompute}
                  />
                )}
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════
                STAGE 2 — LOADING (Cinematic Energy Reading)
               ════════════════════════════════════════════════════ */}
            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center space-y-8 py-8"
              >
                {/* MOQ symbol breathing */}
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
                  {/* Rotating subtle light */}
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

                {/* Typing status messages */}
                <div className="flex flex-col space-y-2.5 items-start min-h-[140px] w-full max-w-xs">
                  {LOADING_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
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
                  {/* Current typing indicator */}
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

            {/* ════════════════════════════════════════════════════
                STAGE 3 — RESULT
               ════════════════════════════════════════════════════ */}
            {step === "result" && result && (
              <ResultCard result={result} onShare={handleShare} onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>
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
        <Magnetic range={30} strength={0.35}>
          <button
            type="submit"
            className="w-full group flex items-center justify-center space-x-2 bg-brand-orange-text text-white font-black text-xs tracking-widest py-4.5 rounded-full shadow-[0_5px_15px_rgba(229,138,43,0.2)] hover:shadow-[0_10px_25px_rgba(229,138,43,0.35)] transition-all duration-[var(--duration-hover)] hover:scale-[1.02] cursor-pointer pulse-glow-moq"
          >
            <span>MODUMU BUL</span>
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
            className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md"
          >
            MODUMU GÖSTER
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="w-full flex flex-col items-center space-y-6 text-center"
    >
      {/* ── "MOQ Seni Seçti" Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-2"
        style={{ color: drink.color }}
      >
        <Sparkles className="w-4 h-4 fill-current animate-pulse" />
        <span className="type-label">✨ MOQ SENİ SEÇTİ</span>
      </motion.div>

      {/* ── Drink Name (huge, with glow) ── */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 140, damping: 12 }}
        className="flex flex-col items-center space-y-1"
      >
        <span className="text-5xl" style={{ filter: `drop-shadow(0 4px 12px ${drink.glowColor})` }}>
          {drink.emoji}
        </span>
        <h4
          className="text-3xl font-black tracking-tight leading-none uppercase name-glow"
          style={{ color: drink.color, ["--glow-color" as string]: drink.glowColor }}
        >
          {drink.name}
        </h4>
      </motion.div>

      {/* ── Placeholder Drink Image Area ── */}
      {/* Kullanıcı görsel ekleyince: src/lib/drinks.ts içindeki image path'i güncelle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center relative placeholder-shimmer"
        style={{
          background: drink.gradient,
          boxShadow: `0 12px 30px ${drink.glowColor}`,
        }}
      >
        <span className="text-4xl opacity-40">{drink.emoji}</span>
      </motion.div>

      {/* ── Energy Map (Enerji Haritası) ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full bg-white/50 border border-white/60 rounded-3xl p-5 text-left space-y-3"
      >
        <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">
          ENERJİ HARİTAN
        </span>
        <EnergyBar emoji="❤️" label="Cesaret" value={energy.cesaret} color="#e04f75" delay={0} />
        <EnergyBar emoji="🌿" label="Dinginlik" value={energy.dinginlik} color="#73b83e" delay={0.15} />
        <EnergyBar emoji="☀️" label="Neşe" value={energy.nese} color="#f0a030" delay={0.3} />
        <EnergyBar emoji="🌊" label="Ferahlık" value={energy.ferahlık} color="#388be6" delay={0.45} />
      </motion.div>

      {/* ── Personality Text ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-left w-full space-y-3"
      >
        <p className="text-xs font-semibold text-brand-navy leading-relaxed whitespace-pre-line">
          {personalityText}
        </p>
        {/* Drink-specific joke */}
        <div className="flex items-start space-x-2 bg-white/40 rounded-2xl p-3 border border-white/50">
          <span className="text-sm">😏</span>
          <p className={`text-[11px] font-bold ${drink.textColor} leading-relaxed`}>
            {drink.joke}
          </p>
        </div>
      </motion.div>

      {/* ── Drink Details Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        className="w-full grid grid-cols-2 gap-4 text-left"
      >
        <div className="bg-white/40 rounded-2xl p-4 border border-white/50">
          <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">
            DÜNYA
          </span>
          <span className={`text-xs font-black ${drink.textColor} mt-1 block`}>
            {drink.worldName}
          </span>
        </div>
        <div className="bg-white/40 rounded-2xl p-4 border border-white/50">
          <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">
            İÇİNDEKİLER
          </span>
          <span className="text-[10px] font-bold text-brand-navy mt-1 block leading-relaxed">
            {drink.ingredients.join(" • ")}
          </span>
        </div>
      </motion.div>

      {/* ── Rare Message (5% chance or easter egg) ── */}
      {showRareMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: "spring" }}
          className="w-full rounded-2xl p-4 border"
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

      {/* ── Mini Joke (random from pool) ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
        className="text-[10px] text-brand-slate italic font-medium leading-relaxed"
      >
        {miniJoke}
      </motion.p>

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="w-full grid grid-cols-3 gap-3 pt-1"
      >
        <Magnetic range={25} strength={0.3}>
          <button
            className="w-full flex items-center justify-center space-x-1.5 text-white font-black text-[10px] tracking-widest py-3.5 rounded-full shadow-lg transition-colors"
            style={{ backgroundColor: drink.color }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>DENE</span>
          </button>
        </Magnetic>

        <Magnetic range={25} strength={0.3}>
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center space-x-1.5 bg-brand-navy text-white font-black text-[10px] tracking-widest py-3.5 rounded-full shadow-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>PAYLAŞ</span>
          </button>
        </Magnetic>

        <Magnetic range={25} strength={0.3}>
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-1.5 bg-white/75 hover:bg-white text-brand-navy font-black text-[10px] tracking-widest py-3.5 rounded-full border border-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TEKRAR</span>
          </button>
        </Magnetic>
      </motion.div>

      {/* ── Friend Invite CTA ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-[10px] text-brand-slate font-medium pt-1"
      >
        Peki arkadaşının MOQ'u ne çıkacak? QR'ı onunla paylaş. 😄
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
  value,
  color,
  delay,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm flex-shrink-0">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black text-brand-navy uppercase tracking-wider">
            {label}
          </span>
          <span className="text-[10px] font-black" style={{ color }}>
            %{Math.round(value)}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-brand-navy/10 overflow-hidden">
          <div
            className="energy-bar-fill h-full rounded-full"
            style={{
              background: color,
              ["--bar-target" as string]: `${value}%`,
              ["--bar-delay" as string]: `${delay}s`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
