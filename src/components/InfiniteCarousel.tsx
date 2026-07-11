"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { PRODUCTS, type Drink } from "@/lib/product-data";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   INFINITE CAROUSEL — Scene 2: Flavor Gallery (The Collection)
   
   Optimized for V2 & SSR-safe:
   - Uses CSS responsive display utilities (hidden md:block and md:hidden)
   - Zero layout flashes / hydration jumps (isMobile state removed from JSX)
   - GSAP carousel autoplay initialized only on desktop screen dimensions client-side
   ═══════════════════════════════════════════════════════════════ */

// 4× duplication for seamless infinite loop on desktop
const itemsList = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS, ...PRODUCTS];

// Individual card with 3D tilt on hover (Desktop only)
function ProductCard({ item }: { item: Drink }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 8, rotateY: x * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleDiscoverClick = () => {
    document.getElementById("worlds-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -12, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleDiscoverClick}
      data-card
      className="w-[280px] h-[390px] md:w-[320px] md:h-[430px] flex-shrink-0 rounded-[2.5rem] flex flex-col justify-between p-7 relative overflow-hidden gleam-effect card-hover border border-white/60 shadow-[0_12px_30px_rgba(15,108,189,0.03)] cursor-pointer"
      style={{
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: "transform 250ms cubic-bezier(.22,.61,.36,1)",
        backdropFilter: "blur(15px)",
        background: item.bgStyle,
      }}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-0"
        style={{ backgroundColor: item.accentColor }}
      />

      {/* Card Top Information */}
      <div className="flex flex-col space-y-1 relative z-[3] text-left">
        <span className={`text-sm md:text-base font-extrabold tracking-wider ${item.textColorClass}`}>
          {item.name}
        </span>
        <span className="text-[10px] md:text-xs font-bold text-brand-slate/80">
          {item.ingredients.join(" • ")}
        </span>
      </div>

      {/* Middle square image box matching the mockup */}
      <div className="w-full flex justify-center items-center my-2 relative z-[2]">
        <div className="relative w-full aspect-square max-w-[170px] md:max-w-[200px] rounded-[1.8rem] overflow-hidden shadow-md border border-white/40">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 170px, 200px"
          />
        </div>
      </div>

      {/* Card CTA */}
      <div className="flex justify-start relative z-[3]">
        <span className="type-button text-[9px] md:text-[10px] font-extrabold tracking-widest text-brand-navy bg-white hover:bg-brand-navy hover:text-white px-6 py-3 rounded-full shadow-sm border border-white transition-all duration-300">
          KEŞFET
        </span>
      </div>
    </motion.div>
  );
}

// Mobile Card: Tap only, opens Bottom Sheet (PROD-2)
function MobileProductCard({ item, onClick }: { item: Drink; onClick: (id: string) => void }) {
  return (
    <motion.div
      whileTap={{ scale: 1.03 }}
      onClick={() => onClick(item.id)}
      className="w-[170px] h-[250px] rounded-[1.8rem] flex flex-col justify-between p-4 relative overflow-hidden border border-white/40 shadow-[0_8px_20px_rgba(15,108,189,0.02)] cursor-pointer"
      style={{
        background: item.bgStyle,
      }}
    >
      {/* Card Header */}
      <div className="flex flex-col space-y-0.5 text-left z-[3]">
        <span className={`text-xs font-black tracking-wider ${item.textColorClass}`}>
          {item.name}
        </span>
        <span className="text-[8px] font-bold text-brand-slate/75 line-clamp-1">
          {item.ingredients.join(" • ")}
        </span>
      </div>

      {/* Drink Image Box */}
      <div className="w-full flex justify-center items-center my-1 z-[2]">
        <div className="relative w-full aspect-square max-w-[100px] rounded-[1.2rem] overflow-hidden shadow-sm border border-white/30">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="350px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Card CTA */}
      <div className="flex justify-start z-[3]">
        <span className="text-[8px] font-black tracking-widest text-brand-navy bg-white px-4 py-2 rounded-full shadow-sm border border-white">
          KEŞFET
        </span>
      </div>
    </motion.div>
  );
}

interface InfiniteCarouselProps {
  onDrinkClick?: (id: string) => void;
}

export default function InfiniteCarousel({ onDrinkClick = () => {} }: InfiniteCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Dragging state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const prevTranslate = useRef(0);
  const dragVelocity = useRef(0);
  const lastTime = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    // Only initialize GSAP loop client-side on desktop views
    const isMobileView = window.innerWidth < 768;
    if (isMobileView) return;

    const track = trackRef.current;
    if (!track) return;

    const totalItems = track.children.length;
    const singleSetCount = PRODUCTS.length;
    const singleSetWidth = track.scrollWidth / (totalItems / singleSetCount);

    const initTween = () => {
      if (tweenRef.current) tweenRef.current.kill();

      tweenRef.current = gsap.to(track, {
        x: -singleSetWidth,
        duration: 25,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const val = parseFloat(x) % singleSetWidth;
            return `${val}px`;
          }),
        },
      });
    };

    const timer = setTimeout(initTween, 500);
    return () => {
      clearTimeout(timer);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isDragging.current && tweenRef.current) tweenRef.current.pause();
  };

  const handleMouseLeave = () => {
    if (!isDragging.current && tweenRef.current) tweenRef.current.play();
    handleDragEnd();
  };

  const handleDragStart = useCallback((clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    lastX.current = clientX;
    lastTime.current = performance.now();
    dragVelocity.current = 0;
    if (tweenRef.current) tweenRef.current.pause();

    const matrix = window.getComputedStyle(trackRef.current!).transform;
    if (matrix !== "none") {
      const parts = matrix.split(",");
      prevTranslate.current = parseFloat(parts[4] || "0");
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging.current || !trackRef.current) return;
    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = clientX - lastX.current;
    if (dt > 0) dragVelocity.current = dx / dt;

    const deltaX = clientX - startX.current;
    gsap.set(trackRef.current, { x: prevTranslate.current + deltaX });
    lastX.current = clientX;
    lastTime.current = now;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const glideAmt = dragVelocity.current * 180;

    if (trackRef.current) {
      const matrix = window.getComputedStyle(trackRef.current).transform;
      let finalTranslate = 0;
      if (matrix !== "none") {
        const parts = matrix.split(",");
        finalTranslate = parseFloat(parts[4] || "0") + glideAmt;
      }

      gsap.to(trackRef.current, {
        x: finalTranslate,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (tweenRef.current) {
            const trackWidth = trackRef.current!.scrollWidth;
            const singleSetWidth = trackWidth / (itemsList.length / PRODUCTS.length);
            const currentX = finalTranslate % singleSetWidth;
            gsap.set(trackRef.current, { x: currentX });
            tweenRef.current.play();
          }
        },
      });
    }
  }, []);

  return (
    <section
      id="carousel-section"
      className="relative py-12 md:py-24 w-full overflow-hidden px-6 md:px-12 flex flex-col items-center select-none scene"
    >
      <div className="max-w-[1280px] w-full flex flex-col space-y-8 md:space-y-12 relative z-20">
        {/* Editorial Section Header */}
        <div className="flex flex-col items-start space-y-2 md:space-y-3">
          <span className="type-label text-brand-blue-text">
            LEZZETLERİ KEŞFET
          </span>
          <h2 className="type-scene-title text-brand-navy font-sans">
            HER LEZZETİ KEŞFET
          </h2>
          <p className="type-body text-brand-slate max-w-md">
            Modunuza en uygun dünyayı seçin.
          </p>
        </div>

        {/* Mobile View */}
        {isMobile && (
          <div className="flex flex-col items-center space-y-8 w-full">
            <div className="grid grid-cols-2 gap-4 justify-items-center w-full max-w-[360px]">
              {PRODUCTS.map((item) => (
                <MobileProductCard key={item.id} item={item} onClick={onDrinkClick} />
              ))}
            </div>
            {/* Mobile Separator */}
            <div className="flex items-center justify-center space-x-4 w-full py-4 opacity-50">
              <div className="h-[1px] bg-brand-slate/20 w-12" />
              <span className="text-[10px] font-black tracking-widest text-brand-slate uppercase">
                Dünyalara Adım Atın
              </span>
              <div className="h-[1px] bg-brand-slate/20 w-12" />
            </div>
          </div>
        )}

        {/* Desktop View */}
        {isMobile === false && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            data-drag-hint="true"
            className="infinite-carousel w-full overflow-hidden cursor-grab active:cursor-grabbing py-6 flex"
          >
            <div ref={trackRef} className="flex space-x-8 will-change-transform">
              {itemsList.map((item, index) => (
                <ProductCard key={`${item.id}-${index}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
