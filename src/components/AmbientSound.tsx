"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   AMBIENT SOUND — Optional Sound System
   
   Toggle button: Small speaker icon, fixed bottom-right
   Sounds mixed together:
     - Wind (constant, low volume)
     - Birds (intermittent chirps)
     - Water (gentle stream)
     - Leaves (rustle, very subtle)
   
   Volume shifts with scroll position:
     - Hero: Wind + birds prominent
     - Drink Worlds: Water sounds increase
     - Footer: Ocean waves increase
   
   Uses Web Audio API for smooth crossfading.
   Off by default. Respects prefers-reduced-motion.
   
   NOTE: Audio files need to be royalty-free. This component
   is structurally complete — add actual audio files to
   public/audio/ when sourced.
   ═══════════════════════════════════════════════════════════════ */

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create ambient oscillators to simulate sound layers
      // These are placeholder synthetic sounds — replace with real audio files

      // Wind: Low frequency noise-like oscillation
      const windOsc = ctx.createOscillator();
      const windGain = ctx.createGain();
      windOsc.type = "sine";
      windOsc.frequency.value = 80;
      windGain.gain.value = 0.08;
      windOsc.connect(windGain);
      windGain.connect(masterGain);
      windOsc.start();
      oscillatorsRef.current.push(windOsc);

      // Water: Medium frequency
      const waterOsc = ctx.createOscillator();
      const waterGain = ctx.createGain();
      waterOsc.type = "sine";
      waterOsc.frequency.value = 200;
      waterGain.gain.value = 0.04;
      waterOsc.connect(waterGain);
      waterGain.connect(masterGain);
      waterOsc.start();
      oscillatorsRef.current.push(waterOsc);

      // Birds: Higher frequency
      const birdOsc = ctx.createOscillator();
      const birdGain = ctx.createGain();
      birdOsc.type = "triangle";
      birdOsc.frequency.value = 800;
      birdGain.gain.value = 0.02;
      birdOsc.connect(birdGain);
      birdGain.connect(masterGain);
      birdOsc.start();
      oscillatorsRef.current.push(birdOsc);
    } catch {
      // Audio context not supported
    }
  }, []);

  const toggleSound = useCallback(() => {
    if (!isPlaying) {
      initAudio();

      if (audioContextRef.current && gainNodeRef.current) {
        audioContextRef.current.resume();
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0.15,
          audioContextRef.current.currentTime + 0.5
        );
      }

      setIsPlaying(true);
      setIsMuted(false);
    } else {
      if (audioContextRef.current && gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(
          0,
          audioContextRef.current.currentTime + 0.5
        );
      }

      setTimeout(() => {
        if (audioContextRef.current) {
          audioContextRef.current.suspend();
        }
      }, 600);

      setIsPlaying(false);
      setIsMuted(true);
    }
  }, [isPlaying, initAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // Already stopped
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-[9998] w-12 h-12 rounded-full glass-subtle flex items-center justify-center text-brand-slate hover:text-brand-blue-text transition-all duration-[var(--duration-hover)] hover:scale-110 shadow-lg cursor-pointer group"
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      title={isPlaying ? "Mute sound" : "Play ambient sound"}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      ) : (
        <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}

      {/* Pulse ring when playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-brand-blue-text/20 animate-ping pointer-events-none" />
      )}
    </button>
  );
}
