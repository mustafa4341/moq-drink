"use client";

import React, { useRef, useState, useEffect } from "react";

import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS, type Drink } from "@/lib/product-data";
import { useIsMobile } from "@/hooks/useIsMobile";
import ProductVisual from "./ProductVisual";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Desktop Product Card
function ProductCard({
  item,
  index,
  cardRef,
  onDiscover,
}: {
  item: Drink;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  onDiscover: (id: string) => void;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 8, rotateY: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 select-none pointer-events-auto"
      style={{ width: "320px", height: "440px" }}
      data-cursor="ENTER"
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          w-full h-full rounded-[2.5rem] flex flex-col justify-between p-7 relative overflow-hidden 
          border border-white/60 shadow-[0_12px_30px_rgba(15,108,189,0.03)] transition-transform duration-300 ease-out
        "
        style={{
          transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          background: item.bgStyle,
          backdropFilter: "blur(15px)",
        }}
      >
        {/* Accent glow on hover */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none z-0"
          style={{ backgroundColor: item.colors.primary }}
        />

        {/* Card Header (Product Visual) */}
        <div className="w-full flex justify-center items-center py-2 relative z-[2]">
          <ProductVisual
            image={item.image}
            name={item.name}
            emoji={item.emoji}
            colors={item.colors}
            size="md"
            className="rounded-[1.8rem]"
          />
        </div>

        {/* Card Body Info */}
        <div className="flex flex-col space-y-1 relative z-[3] text-center my-3">
          <span className={`text-base md:text-lg font-black tracking-tight ${item.textColorClass}`}>
            {item.name}
          </span>
          <span className="text-[11px] md:text-xs font-bold text-brand-slate/80">
            {item.ingredients.join(" • ")}
          </span>
        </div>

        {/* Button - only the button triggers smooth scroll to world */}
        <div className="flex justify-center relative z-[3] mt-auto">
          <button
            type="button"
            onClick={() => onDiscover(item.id)}
            className="
              w-full py-3 rounded-full bg-white hover:bg-brand-navy hover:text-white 
              text-brand-navy text-[10px] font-black tracking-widest uppercase shadow-sm 
              border border-white/80 transition-all duration-300 cursor-pointer hover:scale-[1.02]
            "
          >
            BU DÜNYAYA GİR
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile Card: Tap only, opens Bottom Sheet
function MobileProductCard({ item, onClick }: { item: Drink; onClick: (id: string) => void }) {
  return (
    <motion.div
      whileTap={{ scale: 1.03 }}
      onClick={() => onClick(item.id)}
      className="w-[170px] h-[250px] md:w-[170px] md:h-[250px] rounded-[1.8rem] flex-shrink-0 flex flex-col justify-between p-4 relative overflow-hidden border border-white/40 shadow-[0_8px_20px_rgba(15,108,189,0.02)] cursor-pointer"
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

interface TasteJourneyProps {
  onDrinkClick?: (id: string) => void;
  onDiscover?: (id: string) => void;
  activeWorldId?: string;
  isWorldActive?: boolean;
  onWorldActiveChange?: (active: boolean) => void;
}

export default function TasteJourney({
  onDrinkClick = () => {},
  onDiscover = () => {},
  activeWorldId = "cool-lime",
  isWorldActive = false,
  onWorldActiveChange = () => {},
}: TasteJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => { lenisRef.current = lenis; }, [lenis]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePage, setActivePage] = useState(0);

  // Reduced Motion Detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const handleDiscover = (id: string) => {
    onDiscover(id);
  };

  // GSAP ScrollTrigger Pinned Horizontal Scroll
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        const getScrollDistance = () => 2576;

        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Find active index and map it to max progress
            const activeIdx = PRODUCTS.findIndex((p) => p.id === activeWorldId);
            let progress = self.progress;

            // Cap the progress so the user sees the active card when scrolling up from the world
            if (isWorldActive && activeIdx !== -1) {
              const maxProgress = activeIdx / (PRODUCTS.length - 1);
              progress = Math.min(progress, maxProgress);
            }

            const currentScrollX = progress * getScrollDistance();
            
            // Translate the track horizontally
            gsap.set(track, { x: -currentScrollX });

            // Cards scale/opacity/blur interpolation purely in GSAP to prevent React render lag
            const cardWidth = 320;
            const gap = 48; // gap-12 is 48px
            const step = cardWidth + gap;

            cardsRef.current.forEach((card, index) => {
              if (!card) return;
              const cardX = index * step;
              const distance = Math.abs(cardX - currentScrollX);
              const normalizedDistance = distance / step;

              // Active: scale 1.0, side: scale 0.85, far: scale 0.75
              const scale = 1 - Math.min(0.25, normalizedDistance * 0.15);
              // Active: opacity 1.0, side: opacity 0.55, far: opacity 0.2
              const opacity = 1 - Math.min(0.8, normalizedDistance * 0.45);
              // Active: blur 0px, side: blur 2px, far: blur 4px
              const blurVal = Math.min(4, normalizedDistance * 2);

              gsap.set(card, {
                scale: scale,
                opacity: opacity,
                filter: `blur(${blurVal}px)`,
                overwrite: "auto",
              });
            });

            // Update title state (React state only changes on active index boundaries and when section is active)
            if (self.isActive) {
              const activeIdxForTitle = Math.round(self.progress * (PRODUCTS.length - 1));
              setActiveIndex((prev) => (prev !== activeIdxForTitle && activeIdxForTitle >= 0 && activeIdxForTitle < PRODUCTS.length ? activeIdxForTitle : prev));

              // If world is active, and we scroll up past the natural scroll position of the active card,
              // release the lock/cap so we can scroll back to the previous cards normally with zero jump!
              if (isWorldActive && activeIdx !== -1) {
                const naturalProgress = activeIdx / (PRODUCTS.length - 1);
                const releaseThreshold = Math.max(0.02, naturalProgress);
                if (self.progress < releaseThreshold) {
                  onWorldActiveChange(false);
                }
              }
            }
          },
          // When scrolling back up, teleport the dikey scroll position directly to the active card's position.
          // Since the track capping makes the visual state identical, this is 100% seamless and removes
          // the "dead scroll" range completely.
          onEnterBack: () => {
            const activeIdx = PRODUCTS.findIndex((p) => p.id === activeWorldId);
            if (isWorldActive && activeIdx !== -1) {
              const maxIndex = PRODUCTS.length - 1;
              const targetProgress = maxIndex > 0 ? activeIdx / maxIndex : 0;
              const totalScrollDistance = 2576;
              const targetScrollX = targetProgress * totalScrollDistance;
              const containerTop = container.getBoundingClientRect().top + window.scrollY;
              const snapTarget = containerTop + targetScrollX;

              if (lenisRef.current) {
                lenisRef.current.scrollTo(snapTarget, { immediate: true });
              } else {
                window.scrollTo({ top: snapTarget, behavior: "instant" as ScrollBehavior });
              }
              onWorldActiveChange(false);
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion, activeWorldId, isWorldActive, onWorldActiveChange]);

  // Mobile Snap Scroll listener
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

  const useFallback = isMobile || prefersReducedMotion;

  return (
    <section
      id="taste-journey"
      ref={containerRef}
      className={
        useFallback
          ? "relative py-16 md:py-24 w-full overflow-hidden px-6 flex flex-col items-center select-none bg-transparent"
          : "relative w-full select-none"
      }
      style={
        useFallback
          ? undefined
          : { height: `calc(100vh + ${2576 * 1.3}px)` }
      }
    >
      <div
        className={
          useFallback
            ? "max-w-[1280px] w-full flex flex-col space-y-8 relative z-20 items-center"
            : "sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden"
        }
      >
        {/* Header - Dynamically animates the Active World Title on Desktop only */}
        <div className="flex flex-col items-center text-center space-y-2 md:space-y-3 mb-6 md:mb-12 relative z-20 px-6">
          <span className="type-label text-brand-blue-text uppercase tracking-widest text-[10px] md:text-xs font-black">
            LEZZET YOLCULUĞU
          </span>
          {useFallback ? (
            <div className="flex flex-col items-center text-center space-y-1.5">
              <h2 className="text-3xl md:text-5xl font-black text-brand-navy tracking-tight font-sans">
                DÜNYALARA ADIM ATIN
              </h2>
              <p className="type-body text-brand-slate max-w-md italic text-xs md:text-sm font-medium">
                Modunuza en uygun dünyayı seçin.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center space-y-1.5"
              >
                <h2 className="text-3xl md:text-5xl font-black text-brand-navy tracking-tight font-sans">
                  {PRODUCTS[activeIndex].name} World
                </h2>
                <p className="type-body text-brand-slate max-w-md italic text-xs md:text-sm font-medium">
                  {PRODUCTS[activeIndex].tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Desktop View: Pinned Horizontal Showcase */}
        {!useFallback && (
          <div className="relative w-full flex items-center justify-start h-[520px] z-10">
            {/* Center pointer overlay (hidden but aligns logic) */}
            <div
              ref={trackRef}
              className="flex gap-12 items-center flex-nowrap h-full"
              style={{
                paddingLeft: "calc((100vw - 320px) / 2)",
                paddingRight: "calc((100vw - 320px) / 2)",
              }}
            >
              {PRODUCTS.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={index}
                  cardRef={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  onDiscover={handleDiscover}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile View / Fallback: Paged 2x2 Grid Carousel */}
        {useFallback && (
          <div className="flex flex-col items-center space-y-5 w-full z-10">
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
            <div className="flex justify-center items-center space-x-2.5 py-1 px-4 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm z-20">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activePage === 0 ? "bg-brand-navy scale-125" : "bg-brand-navy/30"}`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activePage === 1 ? "bg-brand-navy scale-125" : "bg-brand-navy/30"}`} />
            </div>

            {/* Mobile Swipe Hint */}
            <div className="flex items-center justify-center space-x-3 w-full opacity-40 z-20">
              <div className="h-[1px] bg-brand-slate/20 w-8" />
              <span className="text-[9px] font-black tracking-widest text-brand-slate uppercase">
                {activePage === 0 ? "Diğer 4 Lezzet için Kaydırın ➔" : "⬅ İlk 4 Lezzete Dönün"}
              </span>
              <div className="h-[1px] bg-brand-slate/20 w-8" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
