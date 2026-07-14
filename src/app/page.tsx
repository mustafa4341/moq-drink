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
import TasteJourney from "@/components/TasteJourney";
import Footer from "@/components/Footer";
import CommunitySection from "@/components/community/CommunitySection";
import CustomCursor from "@/components/CustomCursor";
import BeachPulseWidget from "@/components/BeachPulseWidget";
import { useLenis } from "lenis/react";

// Centralized product data
import { PRODUCTS, type Drink } from "@/lib/product-data";

// Dynamically import components to optimize initial mobile loading (lazy chunks)
const BottomSheet = dynamic(() => import("@/components/BottomSheet"), { ssr: false });
const ProductWorlds = dynamic(() => import("@/components/ProductWorlds"), { ssr: false });
const Story = dynamic(() => import("@/components/Story"), { ssr: false });
const Vision = dynamic(() => import("@/components/Vision"), { ssr: false });
const MoodFinderSection = dynamic(() => import("@/components/MoodFinderSection"), { ssr: false });
const Philosophy = dynamic(() => import("@/components/Philosophy"), { ssr: false });
const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), { ssr: false });

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
     ├─ TasteJourney (Scene 2 — Taste Journey)
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
     ├─ TransitionText: "Bir sahil... / Bir içecek... / Bir anı..."
     ├─ CommunitySection (Scene 8b — Sahilin Nabzı)
     └─ Footer (Scene 9 — cinematic sunset)
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeWorldId, setActiveWorldId] = useState<string>("cool-lime");
  const [isWorldActive, setIsWorldActive] = useState<boolean>(false);
  const lenis = useLenis();

  const handleEntranceComplete = useCallback(() => {
    setIsEntered(true);
    // Garbage collect and unmount CinematicLoading after fade-out transition finishes
    setTimeout(() => {
      setShowLoading(false);
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 1000);
  }, []);

  // Safety fallback: never get stuck on a blank/white screen.
  // If the cinematic loading hasn't signalled completion after 4.5s,
  // force-enter the experience.
  useEffect(() => {
    if (isEntered) return;
    const t = setTimeout(() => {
      setIsEntered(true);
      setTimeout(() => {
        setShowLoading(false);
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }, 1000);
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

  const handleDiscover = useCallback((id: string) => {
    setActiveWorldId(id);
    setIsWorldActive(true);

    const el = document.getElementById("worlds-section");
    const appWrapper = document.querySelector("main") as HTMLElement | null;

    if (appWrapper) {
      // 1. Apply blur + scale shrink immediately
      appWrapper.style.transition = "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms ease";
      appWrapper.style.transform = "scale(0.96) translateY(-12px)";
      appWrapper.style.filter = "blur(4px)";

      // 2. Start smooth scroll to worlds-section simultaneously (1.0s)
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, {
            offset: 0,
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }

      // 3. Clear the blur BEFORE scroll ends (at 650ms) — use instant clear (no animation)
      //    so user arrives at worlds-section fully unblurred.
      setTimeout(() => {
        appWrapper.style.transition = "none";
        appWrapper.style.transform = "scale(1) translateY(0)";
        appWrapper.style.filter = "none";
      }, 650);
    }
  }, [lenis]);

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

          {/* Custom Interactive Desktop Cursor */}
          <CustomCursor activeWorldId={activeWorldId} isWorldActive={isWorldActive} />

          {/* Smooth Scroll Momentum Wrapper */}
          <SmoothScroll>
            {/* Transparent Editorial Navbar */}
            <Navbar onMoodFinderClick={scrollToMoodFinder} />

            {/* ── Cinematic Scroll Journey ──────────────────────── */}
            <main className="w-full flex flex-col">

              {/* Scene 1: Hero — The Arrival */}
              <Hero />

              {/* Mobile Beach Pulse Widget (positioned below Hero) */}
              <div className="w-full lg:hidden flex justify-center py-8 px-6 bg-transparent relative z-20">
                <BeachPulseWidget />
              </div>

              {/* Transition: Hero → Carousel */}
              <TransitionText
                lines={["Her lezzetin", "kendine ait", "bir dünyası var."]}
                align="center"
              />

              {/* Scene 2: Taste Journey — Pinned Horizontal Showcase */}
              <TasteJourney 
                onDrinkClick={handleDrinkClick} 
                onDiscover={handleDiscover}
                activeWorldId={activeWorldId}
                isWorldActive={isWorldActive}
                onWorldActiveChange={setIsWorldActive}
              />


              {/* Transition: Carousel → Drink Worlds */}
              <TransitionText
                lines={["Dünyalara adım atın."]}
                align="center"
              />

              {/* Scene 3: Drink Worlds — The Journey (dynamic living world) */}
              <ProductWorlds activeWorldId={activeWorldId} />

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

              {/* Transition: Instagram → Sahilin Nabzı */}
              <TransitionText
                lines={["Bir sahil...", "Bir içecek...", "Bir anı..."]}
                align="center"
              />

              {/* Scene 8b: Sahilin Nabzı — The Living Wall (community memories) */}
              <CommunitySection />

            </main>

            {/* Scene 9: Footer — The Sunset (Cinematic Ending) */}
            <Footer />

          </SmoothScroll>
        </>
      )}
    </div>
  );
}
