"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

// Map of colors for each drink world (Scene 3 context)
const WORLD_COLORS: Record<string, string> = {
  "cool-lime": "#22c55e",       // Green 🟢
  "limonata": "#eab308",        // Yellow 🟡
  "merida": "#f97316",          // Orange 🟠
  "redline": "#ec4899",         // Pink 🩷
  "sundrop": "#eab308",         // Gold 🟡
  "sunset": "#ff6b6b",          // Coral/Peach 🍑
  "churchill": "#06b6d4",       // Mint/Cyan 🟢
  "portakal-suyu": "#f97316",   // Orange 🟠
};

export default function CustomCursor({
  activeWorldId,
  isWorldActive,
}: {
  activeWorldId: string;
  isWorldActive: boolean;
}) {
  const isMobile = useIsMobile();
  const [cursorType, setCursorType] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics setup for smooth lag follow
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Make cursor visible on movement
      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering over element with data-cursor attribute
      const target = e.target as HTMLElement;
      const hoverEl = target.closest("[data-cursor]") as HTMLElement;
      if (hoverEl) {
        const type = hoverEl.getAttribute("data-cursor");
        setCursorType(type);
      } else {
        setCursorType(null);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Hide native cursor
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isMobile, isVisible, mouseX, mouseY]);

  if (isMobile) return null;
  if (!isVisible) return null;

  // Determine active cursor theme color
  const currentThemeColor = (isWorldActive && WORLD_COLORS[activeWorldId]) || "#1a253c";

  // Check if cursor is expanded with text
  const isHovered = !!cursorType;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer Rotating Portal Ring (Dotted portal ring - ONLY active on ENTER hover) */}
      <AnimatePresence>
        {cursorType === "ENTER" && (
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              borderColor: currentThemeColor,
            }}
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{ 
              opacity: 0.35, 
              scale: 1.15,
              rotate: 360,
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              rotate: { repeat: Infinity, duration: 12, ease: "linear" },
              default: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] border border-dashed rounded-full gpu-layer"
          />
        )}
      </AnimatePresence>
 
      {/* Main Cursor Circle */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          borderColor: currentThemeColor,
          color: currentThemeColor,
        }}
        animate={{
          width: isHovered ? 38 : 14,
          height: isHovered ? 38 : 14,
          backgroundColor: isClicked 
            ? `${currentThemeColor}20` 
            : isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
          scale: isClicked ? 0.85 : 1,
        }}
        transition={{
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center backdrop-blur-[2px] shadow-sm select-none gpu-layer"
      >
        {/* Animated Inner Text Label */}
        <AnimatePresence>
          {isHovered && cursorType !== "HOVER" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-[6.5px] font-black tracking-wider uppercase text-center font-sans leading-none pointer-events-none"
            >
              {cursorType}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
