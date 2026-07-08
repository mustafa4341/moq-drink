"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

import SmoothScroll from "@/components/SmoothScroll";
import CinematicLoading from "@/components/CinematicLoading";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TransitionText from "@/components/TransitionText";
import Vision from "@/components/Vision";
import Philosophy from "@/components/Philosophy";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

// Dynamic Imports for Heavy/Client-only Interactive Components
const WorldBackground = dynamic(() => import("@/components/WorldBackground"), { ssr: false });
const AmbientSound = dynamic(() => import("@/components/AmbientSound"), { ssr: false });
const InfiniteCarousel = dynamic(() => import("@/components/InfiniteCarousel"), { ssr: false });
const ProductWorlds = dynamic(() => import("@/components/ProductWorlds"), { ssr: false });
const Story = dynamic(() => import("@/components/Story"), { ssr: false });
const MoodFinderSection = dynamic(() => import("@/components/MoodFinderSection"), { ssr: false });

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

  const handleEntranceComplete = useCallback(() => {
    setIsEntered(true);
  }, []);

  // Safety fallback: never get stuck on a blank/white screen.
  // If the cinematic loading hasn't signalled completion after 4.5s,
  // force-enter the experience.
  useEffect(() => {
    if (isEntered) return;
    const t = setTimeout(() => setIsEntered(true), 4500);
    return () => clearTimeout(t);
  }, [isEntered]);

  const scrollToMoodFinder = useCallback(() => {
    document.getElementById("mood-finder")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen text-brand-navy selection:bg-brand-blue-bg selection:text-brand-blue-text">
      {/* Scene 0: Cinematic Loading Sequence */}
      <CinematicLoading onComplete={handleEntranceComplete} />

      {isEntered && (
        <>
          {/* 11-Layer Living Background (always present) */}
          <WorldBackground />



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
              <InfiniteCarousel />

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
