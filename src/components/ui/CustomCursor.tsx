"use client";

import React, { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   MOQ CUSTOM CURSOR — Branded cursor with spring physics
   
   States:
     Default: MOQ ring (small, branded)
     Hover (interactive): Ring expands, fill semi-transparent
     Hover (cards): Ring expands further
     Hover (carousel): Ring becomes dashed with "DRAG" text
     Click: Brief squeeze (scale 0.8 → 1)
   
   Hidden on mobile/touch devices.
   ═══════════════════════════════════════════════════════════════ */

type CursorState = "default" | "interactive" | "card" | "drag";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  const [state, setState] = useState<CursorState>("default");
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Size mapping per state
  const sizeMap: Record<CursorState, string> = {
    default: "w-10 h-10",
    interactive: "w-14 h-14",
    card: "w-16 h-16",
    drag: "w-20 h-20",
  };

  // Fill opacity per state
  const fillMap: Record<CursorState, string> = {
    default: "bg-transparent",
    interactive: "bg-brand-blue-text/8",
    card: "bg-brand-blue-text/12",
    drag: "bg-brand-blue-text/5",
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setHidden(false);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA";

      const isCard =
        target.closest(".glass") ||
        target.closest(".glass-portal") ||
        target.closest(".glass-subtle") ||
        target.closest("[data-card]");

      const isDrag =
        target.closest(".infinite-carousel") ||
        target.closest("[data-drag-hint]");

      if (isDrag) {
        setState("drag");
      } else if (isCard) {
        setState("card");
      } else if (isInteractive) {
        setState("interactive");
      } else {
        setState("default");
      }
    };

    const handleMouseOut = () => setState("default");

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // Spring-based animation loop
    let animationFrameId: number;
    const lerp = (start: number, end: number, amt: number) =>
      (1 - amt) * start + amt * end;

    const render = () => {
      // Ring follows with spring lag (lerp = 0.12 for smooth feel)
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12);

      // Dot follows closer (lerp = 0.45)
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.45);
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.45);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Outer Ring — branded MOQ cursor */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-brand-blue-text/40 pointer-events-none transition-all duration-300 ease-moq will-change-transform flex items-center justify-center
          ${sizeMap[state]}
          ${fillMap[state]}
          ${state === "drag" ? "border-dashed border-brand-blue-text/50" : ""}
          ${clicked ? "scale-80 bg-brand-blue-text/20 border-brand-blue-text" : ""}
        `}
      >
        {/* MOQ text inside ring (default state) */}
        {state === "default" && !clicked && (
          <span className="text-[7px] font-black tracking-wider text-brand-blue-text/50 select-none">
            MOQ
          </span>
        )}

        {/* DRAG text inside ring (drag state) */}
        {state === "drag" && (
          <span className="text-[8px] font-black tracking-widest text-brand-blue-text/60 animate-pulse select-none">
            DRAG
          </span>
        )}

        {/* Plus icon inside ring (card state) */}
        {state === "card" && !clicked && (
          <span className="text-sm font-light text-brand-blue-text/40 select-none">
            +
          </span>
        )}
      </div>

      {/* Inner Dot — visible only in default state */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 bg-brand-blue-text rounded-full pointer-events-none will-change-transform transition-all duration-150
          ${state === "default" && !clicked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        `}
      />
    </div>
  );
}
