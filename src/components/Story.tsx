"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/useIsMobile";
import { timelineRegistry } from "@/lib/animation/TimelineRegistry";

// Ensure ScrollTrigger is registered client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════
   STORY — Scene 4: The Origin (Cinematic 4-Scene Short Film)
   
   Responsibilities:
   - Next.js 15 + React 19: Layout, component structure, image optimization
   - Tailwind CSS: Tokens, positioning, and responsive layouts
   - GSAP + ScrollTrigger: Timeline controls scroll-linked transitions
   - Lenis: Synchronized smooth scrolling (global wrapper)
   - Framer Motion: Micro-animations (CTA button interaction)
   ═══════════════════════════════════════════════════════════════ */

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const blossomsLayerRef = useRef<HTMLDivElement>(null);
  
  // Drink Highlight Refs
  const drink1Ref = useRef<HTMLDivElement>(null);
  const drink2Ref = useRef<HTMLDivElement>(null);
  const drink3Ref = useRef<HTMLDivElement>(null);
  
  // Text Scene Refs
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const text4ARef = useRef<HTMLDivElement>(null);
  const text4BRef = useRef<HTMLDivElement>(null);

  // Spotlight Ref
  const spotlightRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const bg = bgRef.current;
    const collage = collageRef.current;
    const blossomsLayer = blossomsLayerRef.current;

    const t1 = text1Ref.current;
    const t2 = text2Ref.current;
    const t3 = text3Ref.current;
    const t4a = text4ARef.current;
    const t4b = text4BRef.current;

    const d1 = drink1Ref.current;
    const d2 = drink2Ref.current;
    const d3 = drink3Ref.current;

    const spl = spotlightRef.current;

    if (!container || !bg || !collage || !t1 || !t2 || !t3 || !t4a || !t4b || !d1 || !d2 || !d3 || !spl) return;

    // Set initial states for clean, readable transitions (lowered blur to 4px)
    gsap.set([t2, t3, t4a, t4b], { opacity: 0, filter: "blur(4px)", y: 60 });
    gsap.set(t1, { opacity: 1, filter: "blur(0px)", y: 0 });

    // Initial drink opacities: Blue active at 12%, others receded at 3%
    gsap.set(d1, { opacity: 0.12, scale: 1 });
    gsap.set([d2, d3], { opacity: 0.03, scale: 0.95 });

    gsap.set(collage, { opacity: 0.04, scale: 1.02 });

    if (blossomsLayer) {
      // Enable falling leaves layer and set initial S1 Blue colors (Baby blue / Light blue)
      gsap.set(blossomsLayer, {
        opacity: 0.8,
        "--particle-color-1": "rgba(165, 214, 255, 0.85)", // Soft baby blue
        "--particle-color-2": "rgba(220, 238, 255, 0.75)", // Light sky blue
      });
    }

    // GSAP ScrollTrigger timeline configuration without rigid snapping
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.8, // Smooth cinematic scrubbing lag
        invalidateOnRefresh: true,
      },
    });

    timelineRegistry.register("story-timeline", tl);

    // ── TRANSITION 1: Scene 1 ➔ Scene 2 (Progress: 0.20 ➔ 0.30 - Quick & Crisp)
    tl.to(bg, { backgroundColor: "#FFE8C5", duration: 0.10 }, 0.20)
      .to(spl, { background: "radial-gradient(circle, rgba(229,138,43,0.15) 0%, transparent 65%)", duration: 0.10 }, 0.20);

    if (blossomsLayer) {
      tl.to(blossomsLayer, {
        "--particle-color-1": "rgba(229, 138, 43, 0.55)", // Highly visible orange
        "--particle-color-2": "rgba(255, 180, 80, 0.5)",   // Highly visible gold
        duration: 0.10
      }, 0.20);
    }

    tl.to(d1, { opacity: 0.03, scale: 0.95, duration: 0.10 }, 0.20)
      .to(d2, { opacity: 0.12, scale: 1, duration: 0.10 }, 0.20)
      // Scene 1 Out (starts at 0.20, ends at 0.27)
      .to(t1, { opacity: 0, filter: "blur(4px)", y: -60, duration: 0.07 }, 0.20)
      .to(".island-layer", { opacity: 0, y: 30, duration: 0.07 }, 0.20)
      // Scene 2 In (starts at 0.25, ends at 0.30 - overlaps with exiting Scene 1)
      .to(t2, { filter: "blur(0px)", duration: 0.03 }, 0.25)
      .to(".palm-layer", { opacity: 1, scale: 1, duration: 0.05 }, 0.25)
      .to(t2, { opacity: 1, y: 0, duration: 0.05 }, 0.25);

    // ── TRANSITION 2: Scene 2 ➔ Scene 3 (Progress: 0.45 ➔ 0.55 - Quick & Crisp)
    tl.to(bg, { backgroundColor: "#FFE4F0", duration: 0.10 }, 0.45)
      .to(spl, { background: "radial-gradient(circle, rgba(224,79,117,0.15) 0%, transparent 65%)", duration: 0.10 }, 0.45);

    if (blossomsLayer) {
      tl.to(blossomsLayer, {
        "--particle-color-1": "rgba(224, 79, 117, 0.5)", // Highly visible pink
        "--particle-color-2": "rgba(115, 184, 62, 0.45)", // Highly visible tea green
        duration: 0.10
      }, 0.45);
    }

    tl.to(d2, { opacity: 0.03, scale: 0.95, duration: 0.10 }, 0.45)
      .to(d3, { opacity: 0.12, scale: 1, duration: 0.10 }, 0.45)
      // Scene 2 Out (starts at 0.45, ends at 0.52)
      .to(t2, { opacity: 0, filter: "blur(4px)", y: -60, duration: 0.07 }, 0.45)
      .to(".palm-layer", { opacity: 0, y: -30, duration: 0.07 }, 0.45)
      // Scene 3 In (starts at 0.50, ends at 0.55 - overlaps with exiting Scene 2)
      .to(t3, { filter: "blur(0px)", duration: 0.03 }, 0.50)
      .to(t3, { opacity: 1, y: 0, duration: 0.05 }, 0.50);

    // ── TRANSITION 3: Scene 3 ➔ Scene 4 (Progress: 0.70 ➔ 0.80 - Quick & Crisp)
    tl.to(bg, { backgroundColor: "#FFFFFF", duration: 0.10 }, 0.70)
      .to(spl, { background: "radial-gradient(circle, rgba(26,37,60,0.06) 0%, transparent 70%)", duration: 0.10 }, 0.70)
      // Drink highlights: d3 recedes to 3%, collage opacity increases to 8% (all drinks equal)
      .to(d3, { opacity: 0.03, scale: 0.95, duration: 0.10 }, 0.70)
      .to(collage, { opacity: 0.08, scale: 1.05, duration: 0.10 }, 0.70)
      // Scene 3 Out (starts at 0.70, ends at 0.77)
      .to(t3, { opacity: 0, filter: "blur(4px)", y: -60, duration: 0.07 }, 0.70);

    if (blossomsLayer) {
      tl.to(blossomsLayer, { opacity: 0, duration: 0.07 }, 0.70); // Fades out completely when S4 goes white
    }

    // S4 Text A (Bugün...) In (starts at 0.75, ends at 0.80 - overlaps with exiting Scene 3)
    tl.to(t4a, { filter: "blur(0px)", duration: 0.02 }, 0.75)
      .to(t4a, { opacity: 1, y: 0, duration: 0.05 }, 0.75)
      // S4 Text A Out (starts at 0.87, ends at 0.91)
      .to(t4a, { opacity: 0, filter: "blur(4px)", y: -20, duration: 0.04 }, 0.87)
      // S4 Final Brand Reveal (starts at 0.90, ends at 0.94 - overlaps with exiting Text A)
      .to(t4b, { filter: "blur(0px)", duration: 0.02 }, 0.90)
      .to(t4b, { opacity: 1, y: 0, duration: 0.04 }, 0.90);

    // Make sure triggers are positioned properly
    ScrollTrigger.refresh();

    return () => {
      timelineRegistry.unregister("story-timeline");
    };
  }, [isMobile]);

  const handleButtonClick = () => {
    document.getElementById("mood-finder")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isMobile === null) {
    return <section id="story" className="relative w-full min-h-[50vh] bg-[#EAF6FF]" />;
  }

  if (isMobile) {
    return (
      <section id="story" className="relative w-full py-12 px-6 bg-[#EAF6FF] text-brand-navy flex flex-col items-center">
        <div className="max-w-[600px] w-full flex flex-col space-y-6">
          <div className="flex flex-col items-start space-y-1">
            <span className="type-label text-brand-blue-text">HİKAYEMİZ</span>
            <h2 className="type-scene-title text-brand-navy font-sans">MOQ NASIL DOĞDU?</h2>
          </div>
          
          <p className="text-sm font-semibold text-brand-slate leading-relaxed">
            MOQ, sıradan bir içecekten fazlası olma hayaliyle doğdu. Doğanın sunduğu en saf ve taze lezzetleri, modern miksoloji teknikleriyle bir araya getirdik. Amacımız her yudumda ruh halinizi değiştirecek benzersiz tat dünyaları yaratmaktı.
          </p>
          <p className="text-sm font-semibold text-brand-slate leading-relaxed">
            Buzul mağaralarının serinliğinden, tropik adaların güneşli sıcaklığına kadar uzanan dört farklı lezzet profilimizle, kendi içsel dünyanızı keşfetmeniz için bir kapı araladık. Her şişe, yeni bir hissin ve ferahlığın hikayesidir.
          </p>

          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/60 shadow-lg my-4">
            <Image
              src="/images/moq_collage.png"
              alt="MOQ Story Collage"
              fill
              sizes="(max-width: 767px) 700px"
              className="object-cover"
            />
          </div>

          <div className="pt-2 flex justify-start">
            <button className="type-button bg-brand-navy text-white hover:bg-brand-blue-text px-8 py-4 rounded-full shadow-md transition-all duration-300">
              DEVAMINI OKU
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative w-full z-10 overflow-visible"
      style={{ height: "400vh" }}
    >
      {/* Sticky Inner Frame */}
      <div
        ref={bgRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center transition-colors duration-1000"
        style={{ backgroundColor: "#EAF6FF" }}
      >
        {/* Layer 1: Sky Collage Background */}
        <div
          ref={collageRef}
          className="absolute inset-0 z-0 pointer-events-none select-none w-full h-full transition-all duration-1000"
        >
          <Image
            src="/images/moq_collage.png"
            alt="MOQ Brand Collage Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Layer 2: Moving Continuous Clouds */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden opacity-[0.05]">
            <div className="absolute top-[8%] left-[-15%] w-[450px] h-[180px] bg-white rounded-full blur-3xl animate-[cloud-drift-slow_50s_linear_infinite]" />
            <div className="absolute top-[35%] right-[-15%] w-[550px] h-[220px] bg-white rounded-full blur-3xl animate-[cloud-drift-fast_40s_linear_infinite]" />
          </div>
        )}

        {/* Layer 3: Spotlight Glow */}
        <div
          ref={spotlightRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[55vh] rounded-full pointer-events-none mix-blend-screen transition-all duration-1000 z-0"
          style={{
            background: "radial-gradient(circle, rgba(56,139,230,0.15) 0%, transparent 65%)",
          }}
        />

        {/* Layer 4: Floating Highlight Drink overlays */}
        <div className="absolute inset-0 pointer-events-none select-none z-1">
          {/* Blue Mojito cup for S1 */}
          <div
            ref={drink1Ref}
            className="absolute left-[10%] md:left-[15%] top-[25%] md:top-[20%] w-[220px] md:w-[320px] h-[350px] md:h-[500px] animate-[float-drink_6s_ease-in-out_infinite]"
          >
            <Image
              src="/images/blue_mojito.png"
              alt="Blue Mojito Highlight"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Passion Breeze cup for S2 */}
          <div
            ref={drink2Ref}
            className="absolute right-[10%] md:right-[15%] top-[25%] md:top-[20%] w-[220px] md:w-[320px] h-[350px] md:h-[500px] animate-[float-drink-delayed_6s_ease-in-out_infinite]"
          >
            <Image
              src="/images/passion_breeze.png"
              alt="Passion Breeze Highlight"
              fill
              className="object-contain"
            />
          </div>

          {/* Berry Boost cup for S3 */}
          <div
            ref={drink3Ref}
            className="absolute left-1/2 top-[25%] md:top-[20%] -translate-x-1/2 w-[220px] md:w-[320px] h-[350px] md:h-[500px] animate-[float-drink_7s_ease-in-out_infinite]"
          >
            <Image
              src="/images/berry_boost.png"
              alt="Berry Boost Highlight"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Layer 5: Ambient Environmental Effects */}
        
        {/* S1: Island Silhouettes */}
        <div className="island-layer absolute bottom-0 left-0 w-full h-[25vh] pointer-events-none select-none z-1">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" fill="none" preserveAspectRatio="none">
            <path d="M0,288L120,266.7C240,245,480,203,720,202.7C960,203,1200,245,1320,266.7L1440,288L1440,320L0,320Z" fill="url(#islandGrad1)" opacity="0.08" />
            <path d="M0,224L180,240C360,256,720,288,1080,277.3C1260,272,1440,224,1440,224L1440,320L0,320Z" fill="url(#islandGrad2)" opacity="0.05" />
            <defs>
              <linearGradient id="islandGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#388be6" />
                <stop offset="100%" stopColor="#EAF6FF" />
              </linearGradient>
              <linearGradient id="islandGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5DA9FF" />
                <stop offset="100%" stopColor="#EAF6FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* S2: Palm Leaves swaying corner overlay */}
        <div className="palm-layer absolute -top-10 -right-10 w-96 h-96 opacity-0 pointer-events-none select-none z-1 origin-top-right">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-brand-orange-text/10 animate-[palm-sway_6s_ease-in-out_infinite]">
            <path d="M10,90 C30,70 60,60 90,50 C75,55 60,65 50,80 C45,70 30,65 10,90 Z M30,60 C40,50 60,45 80,40 C70,43 60,48 50,55 C45,50 35,48 30,60 Z" />
          </svg>
        </div>

        {/* S1, S2, S3: Dynamic-color Leaves and Petals falling */}
        {!isMobile && (
          <div
            ref={blossomsLayerRef}
            className="blossoms-layer absolute inset-0 pointer-events-none select-none z-1 overflow-hidden"
            style={{
              opacity: 0.8,
              "--particle-color-1": "rgba(165, 214, 255, 0.85)", // Soft baby blue
              "--particle-color-2": "rgba(220, 238, 255, 0.75)", // Light sky blue
            } as React.CSSProperties}
          >
            {[...Array(12)].map((_, i) => {
              const size = 20 + (i % 3) * 8; // Enlarged from 12-24px to 20-36px for high visibility
              const delay = i * 0.8;
              const left = 5 + (i * 13) % 90;
              const duration = 8 + (i % 4) * 3;
              const isBlossom = i % 2 === 0;

              return (
                <svg
                  key={i}
                  viewBox="0 0 100 100"
                  className="absolute"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    top: `-5%`,
                    fill: isBlossom ? "var(--particle-color-1)" : "var(--particle-color-2)",
                    animation: `leaf-fall ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {isBlossom ? (
                    <path d="M50,0 C60,20 80,30 80,50 C80,75 50,90 50,90 C50,90 20,75 20,50 C20,30 40,20 50,0 Z" />
                  ) : (
                    <path d="M50,10 C70,30 75,60 50,90 C25,60 30,30 50,10 Z" />
                  )}
                </svg>
              );
            })}
          </div>
        )}

        {/* Layer 6: Cinematic Text Scenes Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full h-full max-w-4xl mx-auto">
          
          {/* Scene 1 Text */}
          <div ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-brand-navy leading-none mb-4">
              Bir Hayal.
            </h2>
            <p className="text-lg md:text-xl font-sans font-medium text-brand-slate max-w-lg">
              Her şey önce bir hayalle başladı.
            </p>
          </div>

          {/* Scene 2 Text */}
          <div ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0">
            <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-brand-orange-text leading-none mb-4">
              Bir Tarif.
            </h2>
            <p className="text-lg md:text-xl font-sans font-medium text-brand-slate max-w-lg">
              Doğadan ilham alan taptaze lezzetler.
            </p>
          </div>

          {/* Scene 3 Text */}
          <div ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0">
            <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-brand-pink-text leading-none mb-4">
              Bir Yudum.
            </h2>
            <p className="text-lg md:text-xl font-sans font-medium text-brand-slate max-w-lg">
              Ve bütün ruh halin değişti.
            </p>
          </div>

          {/* Scene 4A Text */}
          <div ref={text4ARef} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0">
            <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-brand-navy leading-none">
              Bugün...
            </h2>
          </div>

          {/* Scene 4B Text */}
          <div ref={text4BRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0">
            <div className="relative w-[180px] h-[90px] md:w-[260px] md:h-[130px] mb-6">
              <Image
                src="/images/logo_v3.png"
                alt="MOQ Logo"
                fill
                className="object-contain brightness-0"
              />
            </div>
            <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter text-brand-navy leading-none mb-2">
              MOQ DRINK
            </h2>
            <p className="text-sm md:text-base font-sans font-bold uppercase tracking-[0.25em] text-brand-slate mb-8">
              Mood. Sip. Refresh.
            </p>
            
            {/* Action button with Framer Motion hover effect */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleButtonClick}
              className="px-8 py-4 bg-brand-navy text-white text-sm md:text-base font-sans font-bold uppercase tracking-wider rounded-full hover:bg-brand-blue-text transition-colors duration-300 shadow-lg border border-transparent hover:border-brand-navy/20 cursor-pointer"
            >
              Modunu Keşfet
            </motion.button>
          </div>

        </div>
      </div>

      {/* Scoped CSS Keyframes for GPU-accelerated micro-animations */}
      <style jsx global>{`
        @keyframes cloud-drift-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(120vw); }
        }
        @keyframes cloud-drift-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-120vw); }
        }
        @keyframes float-drink {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-1.5deg); }
        }
        @keyframes float-drink-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
        @keyframes palm-sway {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(4deg) scale(1.02); }
        }
        @keyframes leaf-fall {
          0% { transform: translateY(-5vh) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(50px) rotate(180deg); }
          100% { transform: translateY(105vh) translateX(100px) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
