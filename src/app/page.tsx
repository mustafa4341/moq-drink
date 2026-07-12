"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import CinematicLoading from "@/components/CinematicLoading";
import WorldBackground from "@/components/WorldBackground";
import AmbientSound from "@/components/AmbientSound";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TransitionText from "@/components/TransitionText";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import ProductWorlds from "@/components/ProductWorlds";
import Story from "@/components/Story";
import Vision from "@/components/Vision";
import MoodFinderSection from "@/components/MoodFinderSection";
import Philosophy from "@/components/Philosophy";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

// Centralized product data
import { PRODUCTS, type Drink } from "@/lib/product-data";

// Dynamically import BottomSheet to optimize mobile bundle sizes (ARCH-3)
const BottomSheet = dynamic(() => import("@/components/BottomSheet"), { ssr: false });

/* ═══════════════════════════════════════════════════════════════
   MOQ DRINK — Page Assembly
   
   Cinematic Loading (Scene 0)
     ↓
   WorldBackground (11 layers, fixed, beneath everything)
   CustomCursor (fixed, top layer)
   AmbientSound (fixed toggle, bottom-right)
   SmoothScroll (Lenis wrapper)
     ├─ Navbar (fixed, transparent)
     ├─ Hero (Scene 1)
     ├─ TransitionText: "Every flavor has its own world."
     ├─ InfiniteCarousel (Scene 2)
     ├─ TransitionText: "Enter the worlds."
     ├─ ProductWorlds (Scene 3 — 4 worlds)
     ├─ TransitionText: "How it all began..."
     ├─ Story (Scene 4 — 5 full-screen frames)
     ├─ Vision (Scene 5)
     ├─ TransitionText: "What do you feel today?"
     ├─ MoodFinderSection (Scene 6)
     ├─ Philosophy (Scene 7)
     ├─ TransitionText: "Join the world."
     ├─ InstagramFeed (Scene 8)
     └─ Footer (Scene 9 — cinematic sunset)
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleEntranceComplete = useCallback(() => {
    setIsEntered(true);
    // Garbage collect and unmount CinematicLoading after fade-out transition finishes
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  }, []);

  // Safety fallback: never get stuck on a blank/white screen.
  // If the cinematic loading hasn't signalled completion after 4.5s,
  // force-enter the experience.
  useEffect(() => {
    if (isEntered) return;
    const t = setTimeout(() => {
      setIsEntered(true);
      setTimeout(() => setShowLoading(false), 1000);
    }, 4500);
    return () => clearTimeout(t);
  }, [isEntered]);

  const scrollToMoodFinder = useCallback(() => {
    document.getElementById("mood-finder")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDrinkClick = useCallback((drinkId: string) => {
    const drink = PRODUCTS.find((d) => d.id === drinkId);
    if (drink) {
      setSelectedDrink(drink);
      setIsBottomSheetOpen(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen text-brand-navy selection:bg-brand-blue-bg selection:text-brand-blue-text">
      {/* Scene 0: Cinematic Loading Sequence */}
      {showLoading && <CinematicLoading onComplete={handleEntranceComplete} />}

      {isEntered && (
        <>
          {/* 11-Layer Living Background (always present) */}
          <WorldBackground />

          {/* Mobile Bottom Sheet Overlay (dynamic, client-side only) - Lazy loaded (mounted only on open) */}
          {isBottomSheetOpen && (
            <BottomSheet
              drink={selectedDrink}
              isOpen={isBottomSheetOpen}
              onClose={() => setIsBottomSheetOpen(false)}
            />
          )}

          {/* Optional Ambient Sound Toggle */}
          <AmbientSound />

          {/* Smooth Scroll Momentum Wrapper */}
          <SmoothScroll>
            {/* Transparent Editorial Navbar */}
            <Navbar onMoodFinderClick={scrollToMoodFinder} />

            {/* ── Cinematic Scroll Journey ──────────────────────── */}
            <main className="w-full flex flex-col">

              {/* Scene 1: Hero — The Arrival */}
              <Hero />

              {/* Transition: Hero → Carousel */}
              <TransitionText
                lines={["Her lezzetin", "kendine ait", "bir dünyası var."]}
                align="center"
              />

              {/* Scene 2: Flavor Collection — The Gallery */}
              <InfiniteCarousel onDrinkClick={handleDrinkClick} />


              {/* Transition: Carousel → Drink Worlds */}
              <TransitionText
                lines={["Dünyalara adım atın."]}
                align="center"
              />

              {/* Scene 3: Drink Worlds — The Journey (4 living worlds) */}
              <ProductWorlds />

              {/* Transition: Drink Worlds → Story */}
              <TransitionText
                lines={["Her şey nasıl başladı..."]}
                align="center"
                italic
                warm
              />

              {/* Scene 4: Story — The Origin (5 full-screen frames) */}
              <Story />

              {/* No transition between Story → Vision (seamless flow) */}

              {/* Scene 5: Vision — The Statement */}
              <Vision />

              {/* Transition: Vision → Mood Finder */}
              <TransitionText
                lines={["Bugün nasıl hissediyorsun?"]}
                align="center"
                glowing
              />

              {/* Scene 6: Mood Finder — The Heart (Cloud Gateway) */}
              <MoodFinderSection />

              {/* Scene 7: Philosophy — The Soul */}
              <Philosophy />

              {/* Transition: Philosophy → Instagram */}
              <TransitionText
                lines={["Dünyamıza katılın."]}
                align="center"
              />

              {/* Scene 8: Instagram — The Community */}
              <InstagramFeed />

            </main>

            {/* Scene 9: Footer — The Sunset (Cinematic Ending) */}
            <Footer />

          </SmoothScroll>
        </>
      )}
    </div>
  );
}
