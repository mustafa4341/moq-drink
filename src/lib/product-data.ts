/* ═══════════════════════════════════════════════════════════════
   PRODUCT DATA — Bridge Layer to MOQ_DRINKS
   Ensures backward compatibility for existing components.
   ═══════════════════════════════════════════════════════════════ */

import { MOQ_DRINKS, type Drink as MainDrink } from "./drinks";

export interface Atmosphere {
  colorPrimary: string;
  colorSecondary: string;
  particleType: "ice" | "petals" | "sparkles" | "leaves";
  particleCount: number;
  particleIntensity: "low" | "medium" | "high";
}

export interface Drink extends MainDrink {
  // Compatibility fields for carousel / page / product worlds
  world: string;
  tagline: string;
  description: string;
  mood: string;
  accentColor: string;
  textColorClass: string;
  bgStyle: string;
  bgGrad: string;
  atmosphere: Atmosphere;
}

const particleMap: Record<string, "ice" | "petals" | "sparkles" | "leaves"> = {
  leaf: "leaves",
  snow: "ice",
  spark: "sparkles",
  flower: "petals",
  bubble: "sparkles",
  citrus: "leaves",
};

export const PRODUCTS: Drink[] = MOQ_DRINKS.map((d) => ({
  ...d,
  world: d.worldName,
  tagline: d.subtitle,
  description: d.story,
  mood: d.moods.join(" • "),
  accentColor: d.colors.primary,
  textColorClass: d.textColor,
  bgStyle: `linear-gradient(135deg, ${d.colors.primary}12 0%, ${d.colors.primary}22 100%)`,
  bgGrad: d.desktop.worldGradient,
  atmosphere: {
    colorPrimary: d.colors.primary,
    colorSecondary: d.colors.secondary,
    particleType: particleMap[d.theme.particle] || "sparkles",
    particleCount: 8,
    particleIntensity: "medium",
  },
}));
