"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  );
}
