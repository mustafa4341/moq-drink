/* ═══════════════════════════════════════════════════════════════
   PRODUCT DATA — Centralized typed source for all drink/atmosphere data
   ARCH-5/ARCH-6: Single .ts file exporting a typed array.
   No duplicated per-drink files anywhere.
   ═══════════════════════════════════════════════════════════════ */

/** Atmosphere configuration for a drink world (PWS-12 schema) */
export interface Atmosphere {
  colorPrimary: string;
  colorSecondary: string;
  particleType: "ice" | "petals" | "sparkles" | "leaves";
  particleCount: number;
  particleIntensity: "low" | "medium" | "high";
}

/** Unified Drink interface consumed by every component (ARCH-6) */
export interface Drink {
  id: string;
  name: string;
  world: string;
  tagline: string;
  description: string;
  ingredients: string[];
  mood: string;
  flavorNotes: string[];
  image: string;
  accentColor: string;
  textColorClass: string;
  bgStyle: string;
  bgGrad: string;
  atmosphere: Atmosphere;
}

/** Single source of truth for all 4 product drinks */
export const PRODUCTS: Drink[] = [
  {
    id: "blue-mojito",
    name: "BLUE MOJITO",
    world: "BUZ MAĞARASI",
    tagline: "KRİSTAL FERAHLIK",
    description:
      "Derin buz mağaralarının serinliği, donmuş kristaller ve saf dağ kaynaklarının berraklığı. Her yudumda kutup rüzgarlarının ferahlığını hisset.",
    ingredients: ["Mint", "Lime", "Blue Curacao", "Soda"],
    mood: "Refreshing",
    flavorNotes: ["Citrus", "Cool", "Sharp"],
    image: "/images/blue_mojito.png",
    accentColor: "#388be6",
    textColorClass: "text-brand-blue-text",
    bgStyle: "rgba(226, 239, 253, 0.90)",
    bgGrad: "from-blue-100/60 via-sky-50/30 to-blue-200/40",
    atmosphere: {
      colorPrimary: "#4EC5E0",
      colorSecondary: "#0B3B4A",
      particleType: "ice",
      particleCount: 8,
      particleIntensity: "low",
    },
  },
  {
    id: "berry-boost",
    name: "BERRY BOOST",
    world: "KİRAZ ORMANI",
    tagline: "ENERJİ DOLU TUTKU",
    description:
      "Pembe kiraz ağaçlarının altında bir yürüyüş. Düşen çiçek yaprakları ve taze orman meyvelerinin tatlı patlaması.",
    ingredients: ["Strawberry", "Blueberry", "Raspberry", "Tonic"],
    mood: "Energetic",
    flavorNotes: ["Sweet", "Berry", "Bold"],
    image: "/images/berry_boost.png",
    accentColor: "#e04f75",
    textColorClass: "text-brand-pink-text",
    bgStyle: "rgba(251, 231, 237, 0.90)",
    bgGrad: "from-pink-100/60 via-rose-50/30 to-pink-200/40",
    atmosphere: {
      colorPrimary: "#FF7BAC",
      colorSecondary: "#8B2252",
      particleType: "petals",
      particleCount: 10,
      particleIntensity: "medium",
    },
  },
  {
    id: "passion-breeze",
    name: "PASSION BREEZE",
    world: "TROPİKAL ADA",
    tagline: "EGZOTİK KAÇAMAK",
    description:
      "Altın kumlu plajlarda gün doğumu, ılık deniz meltemi ve sallanan palmiye yaprakları. Egzotik çarkıfelek meyvesinin tropik enerjisiyle tazelen.",
    ingredients: ["Passion Fruit", "Soda", "Crushed Ice"],
    mood: "Tropical",
    flavorNotes: ["Exotic", "Sweet", "Fresh"],
    image: "/images/passion_breeze.png",
    accentColor: "#e58a2b",
    textColorClass: "text-brand-orange-text",
    bgStyle: "rgba(250, 240, 223, 0.90)",
    bgGrad: "from-amber-100/60 via-orange-50/30 to-amber-200/40",
    atmosphere: {
      colorPrimary: "#FFB347",
      colorSecondary: "#D2691E",
      particleType: "sparkles",
      particleCount: 8,
      particleIntensity: "medium",
    },
  },
  {
    id: "lime-fresh",
    name: "LIME FRESH",
    world: "YEŞİL VADİ",
    tagline: "SADE VE DOĞAL",
    description:
      "Akdeniz'in yemyeşil doğası ve sabah çiyiyle yıkanmış limon bahçeleri. Taze nane yaprakları ve organik lime özlerinin canlandırıcı dengesi.",
    ingredients: ["Organic Lime Juice", "Fresh Mint", "Soda"],
    mood: "Natural",
    flavorNotes: ["Lime", "Mint", "Crisp"],
    image: "/images/lime_fresh.png",
    accentColor: "#73b83e",
    textColorClass: "text-brand-green-text",
    bgStyle: "rgba(235, 248, 233, 0.90)",
    bgGrad: "from-emerald-100/60 via-green-50/30 to-emerald-200/40",
    atmosphere: {
      colorPrimary: "#9ACD32",
      colorSecondary: "#556B2F",
      particleType: "leaves",
      particleCount: 8,
      particleIntensity: "low",
    },
  },
];
