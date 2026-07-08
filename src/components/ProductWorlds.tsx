"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Magnetic from "@/components/ui/Magnetic";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   PRODUCT WORLDS — Scene 3: The Journey (4 living worlds)
   
   4 full-screen (100vh) worlds, each a complete living environment:
     1. Blue Mojito — Ice Cave (snow particles, ice crystals, mist)
     2. Berry Boost — Cherry Blossom Forest (falling petals, light rays, fireflies)
     3. Passion Breeze — Tropical Island (birds, palm fronds, water sparkle)
     4. Lime Fresh — Green Valley (leaves, morning mist, light beams, dewdrops)
   
   Transitions: Background crossfade via opacity, 200px overlap
   Particle systems fade in/out with world visibility
   ═══════════════════════════════════════════════════════════════ */

interface WorldConfig {
  id: number;
  name: string;
  tagline: string;
  themeTitle: string;
  description: string;
  image: string;
  bgGrad: string;
  textColor: string;
  particleColor: string;
}

const worldsData: WorldConfig[] = [
  {
    id: 1,
    name: "BLUE MOJITO",
    tagline: "KRİSTAL FERAHLIK",
    themeTitle: "BUZ MAĞARASI",
    description: "Derin buz mağaralarının serinliği, donmuş kristaller ve saf dağ kaynaklarının berraklığı. Her yudumda kutup rüzgarlarının ferahlığını hisset.",
    image: "/images/blue_mojito.png",
    bgGrad: "from-blue-100/60 via-sky-50/30 to-blue-200/40",
    textColor: "text-brand-blue-text",
    particleColor: "rgba(56,139,230,0.4)",
  },
  {
    id: 2,
    name: "BERRY BOOST",
    tagline: "ENERJİ DOLU TUTKU",
    themeTitle: "KİRAZ ORMANI",
    description: "Pembe kiraz ağaçlarının altında bir yürüyüş. Düşen çiçek yaprakları ve taze orman meyvelerinin tatlı patlaması.",
    image: "/images/berry_boost.png",
    bgGrad: "from-pink-100/60 via-rose-50/30 to-pink-200/40",
    textColor: "text-brand-pink-text",
    particleColor: "rgba(224,79,117,0.5)",
  },
  {
    id: 3,
    name: "PASSION BREEZE",
    tagline: "EGZOTİK KAÇAMAK",
    themeTitle: "TROPİKAL ADA",
    description: "Altın kumlu plajlarda gün doğumu, ılık deniz meltemi ve sallanan palmiye yaprakları. Egzotik çarkıfelek meyvesinin tropik enerjisiyle tazelen.",
    image: "/images/passion_breeze.png",
    bgGrad: "from-amber-100/60 via-orange-50/30 to-amber-200/40",
    textColor: "text-brand-orange-text",
    particleColor: "rgba(229,138,43,0.5)",
  },
  {
    id: 4,
    name: "LIME FRESH",
    tagline: "SADE VE DOĞAL",
    themeTitle: "YEŞİL VADI",
    description: "Akdeniz'in yemyeşil doğası ve sabah çiyiyle yıkanmış limon bahçeleri. Taze nane yaprakları ve organik lime özlerinin canlandırıcı dengesi.",
    image: "/images/lime_fresh.png",
    bgGrad: "from-emerald-100/60 via-green-50/30 to-emerald-200/40",
    textColor: "text-brand-green-text",
    particleColor: "rgba(115,184,62,0.5)",
  },
];

// World-specific particle canvas
function WorldParticles({ worldId, color }: { worldId: number; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
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

    const count = worldId === 1 ? 30 : worldId === 2 ? 25 : 20;
    const fallDuration = worldId === 1 ? 8 : 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 3 + 1.5,
        speedY: Math.random() * (canvas.height / (fallDuration * 60)) + 0.3,
        speedX: Math.random() * 0.8 - 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 2 - 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.rotation * 0.02) * 0.3;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (worldId === 1) {
          // Ice crystals — diamond shapes
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, 0);
          ctx.lineTo(0, p.r);
          ctx.lineTo(-p.r, 0);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else if (worldId === 2) {
          // Cherry blossom petals — ellipses
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        } else if (worldId === 3) {
          // Tropical sparkles — circles
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          // Green valley leaves — small elongated shapes
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.7, p.r * 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [worldId, color, isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}

function WorldSection({ world }: { world: WorldConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const worldOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        style={{ opacity: worldOpacity }}
        className={`min-h-screen w-full flex items-center justify-center relative py-32 px-6 md:px-12 bg-gradient-to-b ${world.bgGrad}`}
      >
        {/* World-specific ambient effects */}
        {!isMobile && world.id === 1 && (
          /* Ice cave: Mist at bottom */
          <div className="absolute bottom-0 left-0 w-full h-[30%] blur-3xl pointer-events-none opacity-30 bg-gradient-to-t from-blue-200/50 to-transparent" />
        )}
        {!isMobile && world.id === 2 && (
          /* Cherry blossom: Diagonal light rays */
          <div className="absolute top-0 right-[20%] w-[40%] h-full pointer-events-none opacity-[0.08]" style={{ background: "linear-gradient(135deg, rgba(255,180,200,0.6) 0%, transparent 60%)" }} />
        )}
        {!isMobile && world.id === 3 && (
          /* Tropical: Sun flare from top-right */
          <div className="absolute top-0 right-0 w-[50%] h-[60vh] pointer-events-none opacity-20" style={{ background: "radial-gradient(ellipse at 90% 0%, rgba(255,200,80,0.6) 0%, transparent 55%)" }} />
        )}
        {!isMobile && world.id === 4 && (
          /* Green valley: Morning mist rising */
          <div className="absolute bottom-[10%] left-0 w-full h-24 blur-2xl pointer-events-none opacity-20 bg-gradient-to-t from-emerald-100/60 to-transparent" />
        )}

        {/* Particle canvas */}
        <WorldParticles worldId={world.id} color={world.particleColor} />

        {/* Content */}
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Left: World Text */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-6 flex flex-col space-y-6 text-left items-start"
          >
            <span className={`type-label ${world.textColor}`}>
              {world.tagline}
            </span>

            <h2 className="type-scene-title text-brand-navy font-sans">
              {world.name}{" "}
              <br />
              <span className={world.textColor}>{world.themeTitle}</span>
            </h2>

            <p className="type-body text-brand-slate max-w-xl">
              {world.description}
            </p>

            <div className="pt-2">
              <Magnetic range={30} strength={0.3}>
                <button className="type-button group flex items-center space-x-3 bg-white hover:bg-brand-navy text-brand-navy hover:text-white px-8 py-4 rounded-full border border-white/80 shadow-md transition-all duration-[var(--duration-hover)] cursor-pointer">
                  <span>DÜNYAYI KEŞFET</span>
                </button>
              </Magnetic>
            </div>
          </motion.div>

          {/* Right: Glass Portal with drink */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            <motion.div
              style={{
                scale: imageScale,
                rotate: imageRotate,
                transformStyle: "preserve-3d",
              }}
              className="relative w-[300px] h-[450px] md:w-[380px] md:h-[510px] rounded-t-full glass-portal overflow-hidden shadow-2xl bg-white/5"
            >
              <Image
                src={world.image}
                alt={world.name}
                fill
                className="object-cover animate-float-medium"
                sizes="(max-width: 768px) 300px, 380px"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductWorlds() {
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleContainerScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(index);
  };

  if (isMobile) {
    return (
      <section id="worlds-section" className="relative w-full py-12 px-6 flex flex-col items-center scene bg-[#f0f7fd]">
        <div className="max-w-[1280px] w-full flex flex-col space-y-6">
          <div className="flex flex-col items-start space-y-2">
            <span className="type-label text-brand-blue-text">EGZOTİK DENEYİMLER</span>
            <h2 className="type-scene-title text-brand-navy font-sans">ÜRÜN DÜNYALARI</h2>
          </div>
          
          {/* Scroll snap container */}
          <div
            ref={scrollRef}
            onScroll={handleContainerScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full space-x-6 pb-2"
          >
            {worldsData.map((world) => (
              <div
                key={world.id}
                className="snap-start w-full flex-shrink-0 flex flex-col items-center bg-white/40 border border-white/60 p-6 rounded-[2rem] shadow-sm"
                style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              >
                <span className={`text-[10px] font-black tracking-wider ${world.textColor} mb-2`}>
                  {world.tagline}
                </span>
                <h3 className="text-xl font-black text-brand-navy tracking-tight mb-4">
                  {world.name}
                </h3>
                
                {/* Large responsive drink image inside aspect portal */}
                <div className="relative w-full aspect-[3/4] max-w-[200px] rounded-t-full overflow-hidden border border-white/60 bg-white/5 shadow-lg mb-6">
                  <Image
                    src={world.image}
                    alt={world.name}
                    fill
                    sizes="350px"
                    className="object-cover animate-float-medium"
                  />
                </div>
                
                <p className="text-center text-xs font-semibold text-brand-slate leading-relaxed max-w-xs">
                  {world.description}
                </p>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex space-x-2 justify-center pt-2">
            {worldsData.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i ? "w-6 bg-brand-blue-text" : "w-2 bg-brand-slate/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="worlds-section" className="relative w-full overflow-hidden scene">
      {worldsData.map((world) => (
        <WorldSection key={world.id} world={world} />
      ))}
    </section>
  );
}
