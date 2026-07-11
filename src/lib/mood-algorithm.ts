/* ═══════════════════════════════════════════════════════════════
   MOQ MOOD ALGORITHM — 5-Factor Weighted Scoring System
   
   Deterministic but unpredictable.
   Same input = same output (consistent).
   But nobody can reverse-engineer how the result was formed.
   
   Factors:
     1. Name + Surname Hash   → 30%
     2. Birth Season          → 25%
     3. Birth Month           → 20%
     4. Birth Day             → 15%
     5. Secret MOQ Seed       → 10%
   ═══════════════════════════════════════════════════════════════ */

import { MOQ_DRINKS, RARE_MESSAGES, MINI_JOKES, type MoqDrink } from "./drinks";

// ── Types ──────────────────────────────────────────────────────

export interface EnergyMap {
  cesaret: number;   // 0-100
  dinginlik: number; // 0-100
  nese: number;      // 0-100
  ferahlık: number;  // 0-100
}

export interface MoodResult {
  drink: MoqDrink;
  personalityIndex: number;
  energy: EnergyMap;
  showRareMessage: boolean;
  rareMessage: string;
  miniJoke: string;
}

// ── Constants ─────────────────────────────────────────────────

const SECRET_SEED = "MOQ_IS_DIFFERENT_2026";
const CHURCHILL_ID = "churchill";
const PORTAKAL_ID = "portakal-suyu";

// Season drink mapping: each season favors certain drinks
const SEASON_FAVORITES: Record<string, string[]> = {
  spring: ["merida", "cool-lime"],
  summer: ["redline", "merida", "sundrop"],
  autumn: ["sundrop", "sunset"],
  winter: ["limonata", "sunset", "churchill"],
};

// Energy type from day range
type DayEnergy = "calm" | "balanced" | "energetic";

// Energy type favors drinks with matching dominant trait
const ENERGY_FAVORITES: Record<DayEnergy, string[]> = {
  calm: ["cool-lime", "sunset", "limonata"],
  balanced: ["sundrop", "merida", "portakal-suyu"],
  energetic: ["redline", "merida", "churchill"],
};

// ── Hash Function ─────────────────────────────────────────────

/**
 * Deterministic hash from a string.
 * Returns a positive integer.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = char + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Secondary hash (different seed) for variation selection.
 */
function hashStringV2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ── Season Detection ──────────────────────────────────────────

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// ── Day Energy Type ────────────────────────────────────────────

function getDayEnergy(day: number): DayEnergy {
  if (day <= 10) return "calm";
  if (day <= 20) return "balanced";
  return "energetic";
}

// ── Scoring ────────────────────────────────────────────────────

/**
 * Factor 1: Name Hash (weight 30%)
 * Creates a unique score distribution per person.
 * Returns RAW 0-100 score; weight applied at aggregation.
 */
function scoreByNameHash(nameHash: number): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    const seed = hashString(`${nameHash}_${drink.id}_score`);
    scores[drink.id] = (seed % 100); // raw 0-100
  }
  return scores;
}

/**
 * Factor 2: Birth Season (weight 25%)
 * Favored drinks get higher raw scores.
 */
function scoreBySeason(season: string): Record<string, number> {
  const favorites = SEASON_FAVORITES[season] || [];
  const scores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    scores[drink.id] = favorites.includes(drink.id) ? 100 : 20; // raw
  }
  return scores;
}

/**
 * Factor 3: Birth Month (weight 20%)
 * Month number influences score distribution.
 */
function scoreByMonth(month: number): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    const seed = hashString(`month_${month}_drink_${drink.id}_boost`);
    scores[drink.id] = 25 + (seed % 75); // raw 25-100
  }
  return scores;
}

/**
 * Factor 4: Birth Day (weight 15%)
 * Day energy type favors matching drinks.
 */
function scoreByDay(day: number): Record<string, number> {
  const energy = getDayEnergy(day);
  const favorites = ENERGY_FAVORITES[energy];
  const scores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    scores[drink.id] = favorites.includes(drink.id) ? 100 : 25; // raw
  }
  return scores;
}

/**
 * Factor 5: Secret MOQ Seed (weight 10%)
 * Nobody can predict this contribution.
 */
function scoreBySecretSeed(): Record<string, number> {
  const seedHash = hashString(SECRET_SEED);
  const scores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    const s = hashString(`${seedHash}_secret_${drink.id}_moq`);
    scores[drink.id] = (s % 100); // raw 0-100
  }
  return scores;
}

// ── Easter Egg: Birthday Today ─────────────────────────────────

function isBirthdayToday(month: number, day: number): boolean {
  const now = new Date();
  return now.getMonth() + 1 === month && now.getDate() === day;
}

/**
 * Today's seed — YYYY-MM-DD string.
 * Used to make variation/message selection date-dependent.
 * Same person sees consistent results within a day, different across days.
 */
function getTodaySeed(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── Energy Map Computation ────────────────────────────────────

function computeEnergyMap(
  nameHash: number,
  season: string,
  dayEnergy: DayEnergy,
  secretSeed: number,
): EnergyMap {
  // Blend drink traits weighted by their scores
  const cesaret = clamp(
    30 + (nameHash % 40) + (dayEnergy === "energetic" ? 20 : dayEnergy === "balanced" ? 0 : -15) + (secretSeed % 10) - 5,
    15, 98
  );
  const dinginlik = clamp(
    30 + (hashStringV2(nameHash.toString()) % 40) + (dayEnergy === "calm" ? 20 : dayEnergy === "balanced" ? 5 : -15) + (secretSeed % 10) - 5,
    15, 98
  );
  const nese = clamp(
    30 + ((nameHash * 3) % 40) + (season === "summer" ? 15 : season === "spring" ? 10 : -5) + (secretSeed % 10) - 5,
    15, 98
  );
  const ferahlık = clamp(
    30 + ((nameHash * 7) % 40) + (season === "spring" ? 15 : season === "winter" ? -10 : 0) + (secretSeed % 10) - 5,
    15, 98
  );

  return { cesaret, dinginlik, nese, ferahlık };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ── Main Algorithm ────────────────────────────────────────────

/**
 * MOQ Mood Algorithm — Computes the user's drink match.
 *
 * @param firstName  User's first name
 * @param lastName   User's last name
 * @param birthMonth Birth month (1-12)
 * @param birthDay   Birth day (1-31)
 * @returns MoodResult with drink, energy map, and rare messages
 */
export function computeMood(
  firstName: string,
  lastName: string,
  birthMonth: number,
  birthDay: number,
): MoodResult {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  const nameHash = hashString(fullName);
  const secretHash = hashString(SECRET_SEED);

  // ── Easter Egg: Birthday Today → Portakal Suyu ──
  if (isBirthdayToday(birthMonth, birthDay)) {
    const portakal = MOQ_DRINKS.find((d) => d.id === PORTAKAL_ID)!;
    const todaySeed = getTodaySeed();
    const personalityIndex = hashString(`${nameHash}_${todaySeed}`) % portakal.personalities.length;
    return {
      drink: portakal,
      personalityIndex,
      energy: { cesaret: 55, dinginlik: 80, nese: 95, ferahlık: 72 },
      showRareMessage: true,
      rareMessage: "🎂 Bugün doğum günün! MOQ sana özel bir içecek seçti.",
      miniJoke: "Bugün için doğmuş gibi hissediyor musun? Biz de öyle.",
    };
  }

  // ── Compute all 5 factor scores ──
  const season = getSeason(birthMonth);
  const nameScores = scoreByNameHash(nameHash);
  const seasonScores = scoreBySeason(season);
  const monthScores = scoreByMonth(birthMonth);
  const dayScores = scoreByDay(birthDay);
  const secretScores = scoreBySecretSeed();

  // ── Aggregate scores ──
  const totalScores: Record<string, number> = {};
  for (const drink of MOQ_DRINKS) {
    totalScores[drink.id] =
      (nameScores[drink.id] || 0) * 0.30 +
      (seasonScores[drink.id] || 0) * 0.25 +
      (monthScores[drink.id] || 0) * 0.20 +
      (dayScores[drink.id] || 0) * 0.15 +
      (secretScores[drink.id] || 0) * 0.10;
  }

  // ── Sort drinks by score ──
  const sorted = MOQ_DRINKS.slice().sort(
    (a, b) => (totalScores[b.id] || 0) - (totalScores[a.id] || 0)
  );

  const topScore = totalScores[sorted[0].id] || 0;
  const secondScore = totalScores[sorted[1].id] || 0;

  // ── Easter Egg: Churchill (scores are too close) ──
  // Skorlar 0-100 aralığında aggregate edildiği için, "çok yakın" = < 5 fark.
  // churchillChance < 5 → %5 ihtimalle Churchill çıkar (nadir).
  const scoreDiff = topScore - secondScore;
  const todaySeed = getTodaySeed();
  const churchillChance = hashString(`${nameHash}_${todaySeed}_churchill_roll`) % 100;

  if (scoreDiff < 5 && churchillChance < 5) {
    const churchill = MOQ_DRINKS.find((d) => d.id === CHURCHILL_ID)!;
    const personalityIndex = 0; // Churchill only has 1 variation
    return {
      drink: churchill,
      personalityIndex,
      energy: { cesaret: 62, dinginlik: 82, nese: 44, ferahlık: 36 },
      showRareMessage: true,
      rareMessage: "🎉 Nadir bir sonuç! Churchill çıktı.",
      miniJoke: "Normal olmak fazla normal geldi.",
    };
  }

  // ── Select winner ──
  const winner = sorted[0];

  // Bug 2 fix: Variation depends on BOTH identity AND today's date.
  // "Bugünün MOQ'u" vaadi: aynı kişi farklı günlerde farklı varyasyon görebilir,
  // ama aynı gün içinde tutarlıdır.
  // (todaySeed, Churchill easter egg bloğunda yukarıda tanımlandı)
  const personalityIndex = hashString(`${nameHash}_${todaySeed}_variation`) % winner.personalities.length;

  // ── Compute energy map ──
  const dayEnergy = getDayEnergy(birthDay);
  const energy = computeEnergyMap(nameHash, season, dayEnergy, secretHash);

  // ── Rare message (5% chance) — also date-dependent ──
  const rareRoll = hashString(`${nameHash}_${todaySeed}_rare_roll`) % 100;
  const showRareMessage = rareRoll < 5;

  const rareMessage = RARE_MESSAGES[hashString(`${nameHash}_${todaySeed}_rare_msg`) % RARE_MESSAGES.length];
  const miniJoke = MINI_JOKES[hashString(`${nameHash}_${todaySeed}_joke`) % MINI_JOKES.length];

  return {
    drink: winner,
    personalityIndex,
    energy,
    showRareMessage,
    rareMessage,
    miniJoke,
  };
}

/**
 * Parse a date string (YYYY-MM-DD) into month and day.
 */
export function parseBirthDate(dateStr: string): { month: number; day: number } | null {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return { month, day };
}
