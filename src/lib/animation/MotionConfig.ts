export interface QualityProfile {
  maxParticles: number;
  maxLeaves: number;
  maxClouds: number;
  blurLevel: number;
  useParallax: boolean;
  parallaxLayers: number;
  useCanvas: boolean;
  useFilters: boolean;
  renderBudget: number; // Max active animations
}

export const QualityProfiles: Record<"mobile" | "tablet" | "desktop", QualityProfile> = {
  mobile: {
    maxParticles: 0,
    maxLeaves: 5,
    maxClouds: 2,
    blurLevel: 0,
    useParallax: true,
    parallaxLayers: 3,
    useCanvas: false,
    useFilters: false,
    renderBudget: 3,
  },
  tablet: {
    maxParticles: 18,
    maxLeaves: 12,
    maxClouds: 3,
    blurLevel: 8,
    useParallax: true,
    parallaxLayers: 5,
    useCanvas: true,
    useFilters: true,
    renderBudget: 5,
  },
  desktop: {
    maxParticles: 40,
    maxLeaves: 30,
    maxClouds: 5,
    blurLevel: 16,
    useParallax: true,
    parallaxLayers: 8,
    useCanvas: true,
    useFilters: true,
    renderBudget: 8,
  },
};
