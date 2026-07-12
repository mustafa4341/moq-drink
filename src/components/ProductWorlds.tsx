"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { PRODUCTS, type Drink } from "@/lib/product-data";
import { useIsMobile } from "@/hooks/useIsMobile";
import ProductVisual from "./ProductVisual";

/* ═══════════════════════════════════════════════════════════════
   PRODUCT WORLDS — Scene 3: The Journey (8 living worlds)
   Immersive Awwwards-level transitions, parallax and animations.
   ═══════════════════════════════════════════════════════════════ */

// World-specific particle canvas (Desktop & Mobile optimized)
function WorldParticles({ drinkId, color, isMobile }: { drinkId: string; color: string; isMobile: boolean }) {
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

    // Particle count: 24 on desktop, 12 on mobile (optimizes DOM and GPU footprint)
    const count = isMobile ? 12 : 24;

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
        r: Math.random() * (isMobile ? 3 : 5) + 3,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.45 + 0.15,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 1.0 - 0.5,
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
        ctx.lineWidth = 1.5;

        // Custom GPU-friendly drawing paths matching the drink themes
        if (drinkId === "cool-lime") {
          // Cool Lime: green leaf
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.7, p.r * 1.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (drinkId === "limonata") {
          // Limonata: yellow lemon peel squiggle
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 0.8, false);
          ctx.stroke();
        } else if (drinkId === "merida") {
          // Merida: small orange crescent pieces
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.1, 0, Math.PI, false);
          ctx.arc(0, 0, p.r * 0.5, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "redline") {
          // Redline: small red hibiscus seeds
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.4);
          ctx.quadraticCurveTo(p.r * 0.8, 0, 0, p.r);
          ctx.quadraticCurveTo(-p.r * 0.8, 0, 0, -p.r * 1.4);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "sundrop") {
          // Sundrop: golden sparkles (4-point star)
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.3);
          ctx.quadraticCurveTo(0, 0, p.r * 1.3, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.r * 1.3);
          ctx.quadraticCurveTo(0, 0, -p.r * 1.3, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.r * 1.3);
          ctx.closePath();
          ctx.fill();
        } else if (drinkId === "sunset") {
          // Sunset: peach light sparks
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (drinkId === "churchill") {
          // Churchill: soda bubbles
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.stroke();
        } else if (drinkId === "portakal-suyu") {
          // Portakal Suyu: orange droplets
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.3);
          ctx.bezierCurveTo(p.r, -p.r * 0.5, p.r, p.r, 0, p.r * 1.2);
          ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r * 0.5, 0, -p.r * 1.3);
          ctx.closePath();
          ctx.fill();
        } else {
          // Fallback droplet
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2);
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
  }, [drinkId, color, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}

function WorldSection({ world }: { world: Drink }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Lazy loading IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track if this specific section is actively in view
  const isInView = useInView(ref, { once: false, amount: isMobile ? 0.15 : 0.25 });

  // 60FPS Mouse Parallax using MotionValues (bypasses React re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 });

  const portalX = useTransform(springX, [-0.5, 0.5], isMobile ? [0, 0] : [-5, 5]);
  const portalY = useTransform(springY, [-0.5, 0.5], isMobile ? [0, 0] : [-5, 5]);

  const particlesX = useTransform(springX, [-0.5, 0.5], isMobile ? [0, 0] : [-2, 2]);
  const particlesY = useTransform(springY, [-0.5, 0.5], isMobile ? [0, 0] : [-2, 2]);

  useEffect(() => {
    if (isMobile) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [isMobile, mouseX, mouseY]);

  // Scroll parallax for text elements
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? [10, -10] : [35, -35]);
  const worldOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0]);

  // Split title into words for staggered entrance animation
  const worldWords = world.worldName.split(" ");

  // Entrance animations calculations
  const portalScale = isInView ? 1 : 0.95;
  const portalOpacity = isInView ? 1 : 0;
  const portalBlur = isInView ? 0 : (isMobile ? 10 : 20);

  const handleDiscoverClick = () => {
    const el = document.getElementById("carousel-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      id={`world-section-${world.id}`}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 800px",
      }}
    >
      <motion.div
        className="min-h-screen w-full flex items-center justify-center relative py-16 md:py-24 px-6 md:px-12 transition-all duration-[1000ms] ease-out"
        style={{
          opacity: worldOpacity,
          backgroundColor: isInView ? (world.colors.background || "#ffffff") : "#ffffff",
          backgroundImage: isInView 
            ? `linear-gradient(to bottom, ${world.colors.background || "#ffffff"} 0%, ${world.colors.primary}0a 100%)`
            : "linear-gradient(to bottom, #ffffff 0%, #ffffff 100%)",
        }}
      >
        {/* Lazy load particles and heavy background visual details */}
        {isNearViewport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ x: particlesX, y: particlesY }}
            className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          >
            <div
              className="absolute bottom-0 left-0 w-full h-[35%] blur-3xl pointer-events-none opacity-20"
              style={{
                background: `linear-gradient(to top, ${world.colors.primary}40, transparent)`,
              }}
            />
            <WorldParticles
              drinkId={world.id}
              color={world.colors.primary}
              isMobile={isMobile || false}
            />
          </motion.div>
        )}

        {/* Content wrapper */}
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Side: Staggered Text Details */}
          <motion.div
            style={{ y: textY }}
            className="lg:col-span-6 flex flex-col space-y-5 text-left items-center lg:items-start text-center lg:text-left z-10 order-2 lg:order-1"
          >
            {/* 1. Subtitle Tagline (1.0s delay) */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="type-label px-4 py-1.5 rounded-full bg-white/50 border border-white/60 shadow-sm inline-block"
              style={{ color: world.colors.primary }}
            >
              {world.tagline}
            </motion.span>

            {/* 2. World Title (Word-by-word stagger at 1.2s + Drink name slide-up at 1.35s) */}
            <h2 className="type-scene-title text-brand-navy font-sans uppercase leading-tight">
              <span className="block mb-1">
                {worldWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                    transition={{ duration: 0.5, delay: 1.2 + idx * 0.12, ease: "easeOut" }}
                    className="inline-block mr-2.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 1.35, ease: "easeOut" }}
                style={{ color: world.colors.primary }}
                className="inline-block font-black"
              >
                {world.name}
              </motion.span>
            </h2>

            {/* 3. Description Paragraph (1.5s delay) */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
              className="type-body text-brand-slate max-w-xl leading-relaxed font-semibold"
            >
              {world.description}
            </motion.p>

            {/* 4. Discover Button (1.8s delay with infinite hover breathe) */}
            <div className="pt-2">
              <Magnetic range={25} strength={0.35}>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 10, delay: 1.8 }}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.05, 
                    boxShadow: `0 12px 30px ${world.colors.primary}30` 
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDiscoverClick}
                  className="type-button group flex items-center space-x-3 bg-white hover:bg-brand-navy text-brand-navy hover:text-white px-8 py-4 rounded-full border border-white/80 shadow-md transition-all duration-[var(--duration-hover)] cursor-pointer"
                  style={{
                    boxShadow: `0 8px 24px ${world.colors.primary}15`,
                  }}
                >
                  <span className="font-extrabold uppercase">DÜNYAYI KEŞFET</span>
                </motion.button>
              </Magnetic>
            </div>
          </motion.div>

          {/* Right Side: Glass Portal (Breathing & entrance blur) */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6 order-1 lg:order-2">
            <motion.div
              animate={{
                scale: portalScale,
                opacity: portalOpacity,
                filter: `blur(${portalBlur}px)`,
              }}
              transition={{
                scale: { type: "spring", stiffness: 80, damping: 12, delay: 0.5 },
                opacity: { duration: 0.6, delay: 0.5 },
                filter: { duration: 0.6, delay: 0.5 },
              }}
              className="relative rounded-t-full shadow-2xl z-10 overflow-hidden"
              style={{
                x: portalX,
                y: portalY,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              <ProductVisual
                image={world.image}
                name={world.name}
                emoji={world.emoji}
                colors={world.colors}
                size="xl"
                animatePortal={true}
                isInView={isInView}
                isMobile={isMobile || false}
                className="glass-portal"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default function ProductWorlds() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <section
      id="worlds-section"
      className="relative w-full overflow-hidden scene"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 2000px" }}
    >
      {PRODUCTS.map((world) => (
        <WorldSection key={world.id} world={world} />
      ))}
    </section>
  );
}
