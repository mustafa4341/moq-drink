"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, Share2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   MOOD FINDER — Scene 6: The Heart (Cloud Gateway)
   
   A glowing gateway opens between clouds. The form lives inside.
   Pressing "Discover My Mood" = entering the portal.
   
   Cloud Gateway:
     - Two cloud formations on left/right edges
     - Glowing light beams from center gap
     - Vertical light column (brand blue/gold gradient)
     - Form container floating within the light gateway
     - Ambient particles orbiting
   
   Form: First Name, Last Name, Birthday
     - Premium inputs: transparent bg, bottom-border only, floating labels
     - CTA: "Discover My Mood" glowing button with pulse animation
   
   Loading sequence (2500ms):
     1. Form slides backward (scale down + opacity)
     2. Gateway light intensifies
     3. Liquid morphing shapes in light column
     4. Particles accelerate inward
     5. Flash → result card materializes
   
   Result card:
     - Glassmorphic card with flavor-matched accent glow
     - Mood Name, inspirational message
     - Details grid: Lucky Color (swatch), Lucky Number, Element, Matched Drink
     - Product image with float animation
     - Share button (Web Share API) + "Try Again"
     - Confetti burst on reveal
   ═══════════════════════════════════════════════════════════════ */

interface MoodResult {
  moodName: string;
  description: string;
  moodColor: string;
  colorHex: string;
  luckyNumber: number;
  element: string;
  matchedDrink: string;
  drinkImage: string;
  textColor: string;
  accentGlow: string;
}

const moodsData: MoodResult[] = [
  {
    moodName: "OCEAN SOUL",
    description: "Sakin, derin ve ilham verici enerjinizle bugün etrafınıza dinginlik yayıyorsunuz. Dengeyi arayan ruhunuz için ferahlık dolu bir gün.",
    moodColor: "Gök Mavisi",
    colorHex: "#388be6",
    luckyNumber: 8,
    element: "Su",
    matchedDrink: "BLUE MOJITO",
    drinkImage: "/images/blue_mojito.png",
    textColor: "text-brand-blue-text",
    accentGlow: "rgba(56, 139, 230, 0.3)",
  },
  {
    moodName: "SOLAR ECLIPSE",
    description: "Bugün içinizdeki macera ve tutku ateşi parlıyor. Egzotik enerjinizle çevrenizdekileri peşinizden sürüklemeye hazırsınız.",
    moodColor: "Gün Batımı Altını",
    colorHex: "#e58a2b",
    luckyNumber: 7,
    element: "Ateş",
    matchedDrink: "PASSION BREEZE",
    drinkImage: "/images/passion_breeze.png",
    textColor: "text-brand-orange-text",
    accentGlow: "rgba(229, 138, 43, 0.3)",
  },
  {
    moodName: "WILD BLOSSOM",
    description: "Tutkulu, yaratıcı ve her ortama renk katan neşeli kişiliğinizle orman meyvelerinin tatlı enerjisi bugün sizinle buluşuyor.",
    moodColor: "Gül Rengi",
    colorHex: "#e04f75",
    luckyNumber: 3,
    element: "Toprak",
    matchedDrink: "BERRY BOOST",
    drinkImage: "/images/berry_boost.png",
    textColor: "text-brand-pink-text",
    accentGlow: "rgba(224, 79, 117, 0.3)",
  },
  {
    moodName: "FOREST BREEZE",
    description: "Doğallıktan yana olan, dengeli ve taze fikirleriyle çevresine ışık saçan bir gün. Zihninizi arındırıp tazelenme vakti.",
    moodColor: "Limon Yeşili",
    colorHex: "#73b83e",
    luckyNumber: 5,
    element: "Hava",
    matchedDrink: "LIME FRESH",
    drinkImage: "/images/lime_fresh.png",
    textColor: "text-brand-green-text",
    accentGlow: "rgba(115, 184, 62, 0.3)",
  },
];

export default function MoodFinderSection() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<MoodResult | null>(null);
  
  const isMobile = useIsMobile();
  const [mobileStep, setMobileStep] = useState<"welcome" | "name" | "birthday" | "ready">("welcome");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !surname || !birthDate) return;

    const hashInput = `${name.trim()}${surname.trim()}${birthDate}`.toLowerCase();
    let hashCode = 0;
    for (let i = 0; i < hashInput.length; i++) {
      hashCode = hashInput.charCodeAt(i) + ((hashCode << 5) - hashCode);
    }
    const index = Math.abs(hashCode) % moodsData.length;
    setResult(moodsData[index]);
    setStep("loading");
  };

  // Canvas vortex loading animation
  useEffect(() => {
    if (step !== "loading" || !canvasRef.current || !result) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 240;
    canvas.height = 240;

    let angle = 0;
    let particles: { x: number; y: number; r: number; color: string; speed: number; dist: number }[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: 120,
        y: 120,
        r: Math.random() * 2 + 1,
        color: i % 2 === 0 ? result.colorHex : "#ffffff",
        speed: Math.random() * 0.05 + 0.02,
        dist: Math.random() * 80 + 10,
      });
    }

    let frameCount = 0;
    const animateVortex = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.04;
      frameCount++;

      // Glowing vortex center
      ctx.beginPath();
      ctx.arc(120, 120, 15 + Math.sin(angle) * 3, 0, Math.PI * 2);
      ctx.fillStyle = result.colorHex;
      ctx.shadowColor = result.colorHex;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      particles.forEach((p) => {
        p.dist -= 0.35;
        if (p.dist < 5) p.dist = Math.random() * 80 + 20;

        const px = 120 + Math.cos(angle * p.speed * 8) * p.dist;
        const py = 120 + Math.sin(angle * p.speed * 8) * p.dist;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (frameCount < 120) {
        animationRef.current = requestAnimationFrame(animateVortex);
      } else {
        setStep("result");
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 },
          colors: [result.colorHex, "#ffffff", "#e58a2b"],
        });
      }
    };

    animateVortex();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [step, result]);

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `MOQ Mood - ${result.moodName}`,
        text: `Bugünkü MOQ Modum: ${result.moodName}! Senin modun ne?`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Sonuç kopyalandı! Sosyal medyada paylaşabilirsin.");
    }
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

        {/* Center Glass Portal Form */}
        <div className="w-full max-w-lg glass border border-white/95 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(229,138,43,0.06)] relative overflow-hidden flex flex-col items-center min-h-[460px]">
          <AnimatePresence mode="wait">
            {/* ── Form State ─────────────────────────────────── */}
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

                    {/* Name Input Step */}
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
                          onClick={() => handleSubmit()}
                          className="w-full py-4.5 bg-brand-orange-text text-white font-black text-xs tracking-widest rounded-full shadow-md"
                        >
                          MODUMU GÖSTER
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                    {/* First Name */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="ad" className="type-label text-brand-navy">
                        AD
                      </label>
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

                    {/* Last Name */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="soyad" className="type-label text-brand-navy">
                        SOYAD
                      </label>
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

                    {/* Birthday */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="dob" className="type-label text-brand-navy">
                        DOĞUM TARİHİ
                      </label>
                      <input
                        id="dob"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-white/60 focus:border-brand-orange-text rounded-none px-1 py-3 text-xs text-brand-navy focus:outline-none transition-all font-bold"
                      />
                    </div>

                    {/* CTA Button — Glowing pulse */}
                    <div className="pt-3">
                      <Magnetic range={30} strength={0.35}>
                        <button
                          type="submit"
                          className="w-full group flex items-center justify-center space-x-2 bg-brand-orange-text text-white font-black text-xs tracking-widest py-4.5 rounded-full shadow-[0_5px_15px_rgba(229,138,43,0.2)] hover:shadow-[0_10px_25px_rgba(229,138,43,0.35)] transition-all duration-[var(--duration-hover)] hover:scale-[1.02] cursor-pointer animate-pulse-glow"
                        >
                          <span>MODUMU BUL</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </Magnetic>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* ── Loading Vortex State ────────────────────────── */}
            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center space-y-6 py-6"
              >
                <canvas ref={canvasRef} className="w-[200px] h-[200px] pointer-events-none select-none" />
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-2 text-brand-navy font-black text-xs tracking-widest uppercase">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-orange-text" />
                    <span>Modun Keşfediliyor...</span>
                  </div>
                  <span className="text-[10px] text-brand-slate font-bold">
                    Evrenle frekanslar eşitleniyor...
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Result Card ────────────────────────────────── */}
            {step === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="w-full flex flex-col items-center space-y-6 text-center"
              >
                <div className="flex items-center space-x-2.5 text-brand-orange-text">
                  <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                  <span className="type-label">BUGÜNKÜ MOD SONUCUNUZ</span>
                </div>

                <h4 className="text-3xl font-black text-brand-navy tracking-tight leading-none uppercase">
                  {result.moodName}
                </h4>

                <p className="text-xs font-semibold text-brand-slate leading-relaxed max-w-sm">
                  {result.description}
                </p>

                {/* Details Grid */}
                <div className="w-full grid grid-cols-2 gap-4 bg-white/50 border border-white/60 rounded-3xl p-5 text-left font-sans">
                  <div>
                    <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">MOD RENGİ</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full border border-white/60"
                        style={{ backgroundColor: result.colorHex }}
                      />
                      <span className={`text-xs font-black ${result.textColor}`}>{result.moodColor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">ŞANSLI NUMARA</span>
                    <span className="text-xs font-black text-brand-navy mt-1 block">{result.luckyNumber}</span>
                  </div>
                  <div className="pt-2 border-t border-brand-navy/5">
                    <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">ELEMENT</span>
                    <span className="text-xs font-black text-brand-navy">{result.element}</span>
                  </div>
                  <div className="pt-2 border-t border-brand-navy/5">
                    <span className="text-[8px] font-black text-brand-navy/60 block uppercase tracking-wider">EŞLEŞEN İÇECEK</span>
                    <span className={`text-xs font-black ${result.textColor}`}>{result.matchedDrink}</span>
                  </div>
                </div>

                {/* Matched product display */}
                <div className="flex items-center space-x-5 py-2">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-white/70 border border-white flex items-center justify-center relative shadow-md"
                    style={{ boxShadow: `0 8px 24px ${result.accentGlow}` }}
                  >
                    <Image
                      src={result.drinkImage}
                      alt={result.matchedDrink}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-brand-slate uppercase tracking-wider block">GÜNÜN İÇECEĞİ</span>
                    <span className={`text-sm font-black ${result.textColor}`}>{result.matchedDrink}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="w-full grid grid-cols-2 gap-4 pt-1">
                  <Magnetic range={25} strength={0.3}>
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center space-x-2 bg-brand-navy text-white font-black text-[10px] tracking-widest py-4 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>PAYLAŞ</span>
                    </button>
                  </Magnetic>

                  <Magnetic range={25} strength={0.3}>
                    <button
                      onClick={() => {
                        setStep("form");
                        setMobileStep("welcome");
                      }}
                      className="w-full bg-white/75 hover:bg-white text-brand-navy font-black text-[10px] tracking-widest py-4 rounded-full border border-white transition-colors cursor-pointer"
                    >
                      YENİDEN BUL
                    </button>
                  </Magnetic>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
