"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, type Drink } from "@/lib/product-data";
import { useIsMobile } from "@/hooks/useIsMobile";
import ProductVisual from "./ProductVisual";

/* ═══════════════════════════════════════════════════════════════
   INFINITE CAROUSEL — Scene 2: Flavor Gallery (The Collection)
   Unified 8 MOQ drinks with edge-approaching navigation buttons.
   ═══════════════════════════════════════════════════════════════ */

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
    // Teleportation "Camera Zoom" and blur effect on the main layout
    const appWrapper = document.querySelector("main");
    if (appWrapper) {
      appWrapper.style.transition = "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), filter 900ms ease";
      appWrapper.style.transform = "scale(0.96) translateY(-15px)";
      appWrapper.style.filter = "blur(3px)";
      
      setTimeout(() => {
        appWrapper.style.transform = "scale(1) translateY(0)";
        appWrapper.style.filter = "none";
      }, 600);
    }

    // Smooth scroll to the specific drink world section
    const el = document.getElementById(`world-section-${item.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
        style={{ backgroundColor: item.colors.primary }}
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

      {/* Middle visual illustration */}
      <div className="w-full flex justify-center items-center my-2 relative z-[2]">
        <ProductVisual
          image={item.image}
          name={item.name}
          emoji={item.emoji}
          colors={item.colors}
          size="md"
          className="rounded-[1.8rem]"
        />
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

// Mobile Card: Tap only, opens Bottom Sheet
function MobileProductCard({ item, onClick }: { item: Drink; onClick: (id: string) => void }) {
  return (
    <motion.div
      whileTap={{ scale: 1.03 }}
      onClick={() => onClick(item.id)}
      className="w-[170px] h-[250px] rounded-[1.8rem] flex-shrink-0 flex flex-col justify-between p-4 relative overflow-hidden border border-white/40 shadow-[0_8px_20px_rgba(15,108,189,0.02)] cursor-pointer"
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

      {/* Drink Visual */}
      <div className="w-full flex justify-center items-center my-1 z-[2]">
        <ProductVisual
          image={item.image}
          name={item.name}
          emoji={item.emoji}
          colors={item.colors}
          size="sm"
          className="rounded-[1.2rem]"
        />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mouse coordinate tracking for edge-approaching buttons
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  // Mobile page tracking
  const [activePage, setActivePage] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const scrollLeft = mobileScrollRef.current.scrollLeft;
    const width = mobileScrollRef.current.clientWidth;
    if (width > 0) {
      const page = Math.round(scrollLeft / width);
      setActivePage(page);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current || isMobile) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = rect.width;

    setIsHovered(true);
    
    // Proximity threshold of 240px from container edges
    setHoverLeft(mouseX < 240);
    setHoverRight(mouseX > width - 240);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverLeft(false);
    setHoverRight(false);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    
    // Scroll by card width (320px) + gap (32px) = 352px
    const scrollAmount = 352;
    const targetScroll = containerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
    
    containerRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="carousel-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-12 md:py-24 w-full overflow-hidden px-6 md:px-12 flex flex-col items-center select-none scene group"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}
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

        {/* Mobile View: Paged 2x2 Grid Carousel (4 and 4 pagination) */}
        {isMobile && (
          <div className="flex flex-col items-center space-y-5 w-full">
            
            {/* Horizontal Scroll Track containing two 2x2 Grid Pages */}
            <div 
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory w-full py-4 overflow-y-hidden"
            >
              {/* Page 1: First 4 Drinks */}
              <div className="w-full flex-shrink-0 snap-center px-4 flex justify-center">
                <div className="grid grid-cols-2 gap-4 justify-items-center w-full max-w-[360px]">
                  {PRODUCTS.slice(0, 4).map((item) => (
                    <MobileProductCard key={item.id} item={item} onClick={onDrinkClick} />
                  ))}
                </div>
              </div>

              {/* Page 2: Next 4 Drinks */}
              <div className="w-full flex-shrink-0 snap-center px-4 flex justify-center">
                <div className="grid grid-cols-2 gap-4 justify-items-center w-full max-w-[360px]">
                  {PRODUCTS.slice(4, 8).map((item) => (
                    <MobileProductCard key={item.id} item={item} onClick={onDrinkClick} />
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Apple-Style Glass Dots Indicator */}
            <div className="flex justify-center items-center space-x-2.5 py-1 px-4 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-sm">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activePage === 0 ? "bg-brand-navy scale-125" : "bg-brand-navy/30"}`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activePage === 1 ? "bg-brand-navy scale-125" : "bg-brand-navy/30"}`} />
            </div>
            
            {/* Mobile Swipe Hint */}
            <div className="flex items-center justify-center space-x-3 w-full opacity-40">
              <div className="h-[1px] bg-brand-slate/20 w-8" />
              <span className="text-[9px] font-black tracking-widest text-brand-slate uppercase">
                {activePage === 0 ? "Diğer 4 Lezzet için Kaydırın ➔" : "⬅ İlk 4 Lezzete Dönün"}
              </span>
              <div className="h-[1px] bg-brand-slate/20 w-8" />
            </div>
          </div>
        )}

        {/* Desktop View: Button Navigated Scroll Track */}
        {isMobile === false && (
          <div 
            ref={wrapperRef}
            className="relative w-full flex items-center group/carousel"
          >
            
            {/* Prev Edge Button - Apple Glassmorphic style, appears on proximity */}
            <button
              onClick={() => handleScroll("left")}
              aria-label="Önceki"
              className={`absolute left-4 md:left-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-brand-navy flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(26,37,60,0.08)] active:scale-95 hover:bg-white/35 hover:border-white/40 ${
                isHovered && hoverLeft 
                  ? "opacity-100 translate-x-0 scale-110 pointer-events-auto" 
                  : "opacity-0 translate-x-[-15px] pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Edge Button - Apple Glassmorphic style, appears on proximity */}
            <button
              onClick={() => handleScroll("right")}
              aria-label="Sonraki"
              className={`absolute right-4 md:right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-brand-navy flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(26,37,60,0.08)] active:scale-95 hover:bg-white/35 hover:border-white/40 ${
                isHovered && hoverRight 
                  ? "opacity-100 translate-x-0 scale-110 pointer-events-auto" 
                  : "opacity-0 translate-x-[15px] pointer-events-none"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scroll Container */}
            <div
              ref={containerRef}
              className="flex space-x-8 overflow-x-auto scrollbar-none scroll-smooth w-full py-4 px-4 snap-x snap-mandatory"
            >
              {PRODUCTS.map((item) => (
                <div key={item.id} className="snap-start flex-shrink-0">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
