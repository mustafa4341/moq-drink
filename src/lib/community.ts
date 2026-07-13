/* ═══════════════════════════════════════════════════════════════
   Sahilin Nabzı — Data Layer (Repository Pattern)
   ───────────────────────────────────────────────────────────────
   Two implementations of CommunityRepository:
     • MockCommunityRepository      — in-memory, no deps, used now
     • SupabaseCommunityRepository  — dormant; activates when env set

   getCommunityRepository() is the SINGLE switch point. It asks
   getSupabase() whether credentials exist; if not, returns the mock.
   The hook (useCommunityFeed) only knows about the interface.
   ═══════════════════════════════════════════════════════════════ */

import {
  type Beach,
  type BeachPost,
  type CommunityRepository,
  type CreatePostResult,
  type NewPostInput,
  BEACHES,
  VALIDATION,
} from "@/types/community";
import { getSupabase } from "@/lib/supabase";

/* ─── helpers ─────────────────────────────────────────────────── */

/** Trim + collapse internal whitespace runs. */
function normalize(input: NewPostInput): NewPostInput {
  return {
    username: input.username.trim(),
    text: input.text.trim().replace(/\s{2,}/g, " "),
    beach: input.beach,
  };
}

export function validateUsername(username: string): string | null {
  const u = username.trim();
  if (u.length < VALIDATION.username.minLength)
    return `Kullanıcı adı en az ${VALIDATION.username.minLength} karakter olmalı.`;
  if (u.length > VALIDATION.username.maxLength)
    return `Kullanıcı adı en fazla ${VALIDATION.username.maxLength} karakter olmalı.`;
  if (!VALIDATION.username.pattern.test(u))
    return "Sadece harf, rakam ve alt çizgi kullanabilirsin.";
  return null;
}

export function validateMessage(text: string): string | null {
  const t = text.trim();
  if (t.length < VALIDATION.message.minLength)
    return `Mesaj en az ${VALIDATION.message.minLength} karakter olmalı.`;
  if (t.length > VALIDATION.message.maxLength)
    return `Mesaj en fazla ${VALIDATION.message.maxLength} karakter olmalı.`;
  return null;
}

/**
 * Minimal Turkish profanity list. Not exhaustive — MVP-grade only.
 * Matches whole words, case-insensitive, ignoring diacritics loosely.
 */
const BANNED_WORDS = [
  "amk", "aq", "orusbu", "orusbuçocuğu", "piç", "yarrak", "yarram",
  "göt", "götveren", "oç", "oc", "sik", "sikerim", "siktir", "ananı",
  "ananısikerim", "pezevenk", "kahpe", "yavşak", "mal", "salak",
  "aptal", "gerizekalı", "fuck", "shit", "bitch", "asshole",
];

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((w) => {
    // word-boundary-ish check (works for Turkish chars via lowercasing)
    const re = new RegExp(`(^|[^a-zçğıöşü0-9])${w}([^a-zçğıöşü0-9]|$)`, "i");
    return re.test(lower);
  });
}

/**
 * Turkish relative time formatter.
 *   Az önce / 3 dakika önce / 2 saat önce / Dün / 3 gün önce
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now - then);
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 45) return "Az önce";
  if (min < 60) return `${min} dakika önce`;
  if (hr < 24) return `${hr} saat önce`;
  if (day === 1) return "Dün";
  if (day < 7) return `${day} gün önce`;
  // older than a week → absolute date dd.mm.yyyy
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Returns true if the user may post again (rate limit not active). */
export function canPostAgain(
  lastPostAt: number | null,
  now: number = Date.now()
): boolean {
  if (!lastPostAt) return true;
  return now - lastPostAt >= VALIDATION.rateLimitSeconds * 1000;
}

/** Seconds remaining until the user can post again, 0 if allowed. */
export function rateLimitRemainingSec(
  lastPostAt: number | null,
  now: number = Date.now()
): number {
  if (!lastPostAt) return 0;
  const remaining = VALIDATION.rateLimitSeconds - Math.floor((now - lastPostAt) / 1000);
  return Math.max(0, remaining);
}

/** RFC4122-ish uuid. Falls back to crypto if available (browser). */
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ─── Mock repository ─────────────────────────────────────────── */

const SEED_POSTS: Array<Omit<BeachPost, "id">> = [];

const SIMULATED_LATENCY_MS = 280;

class MockCommunityRepository implements CommunityRepository {
  // Mutable, newest-first after construction.
  private posts: BeachPost[];

  constructor() {
    // Reverse the ascending seed into newest-first.
    this.posts = SEED_POSTS.map((p) => ({ ...p, id: uuid() })).reverse();
  }

  async fetchPosts(limit: number = VALIDATION.initialPageSize): Promise<BeachPost[]> {
    await delay(SIMULATED_LATENCY_MS);
    return this.posts.slice(0, limit).map(clone);
  }

  async createPost(input: NewPostInput): Promise<CreatePostResult> {
    await delay(SIMULATED_LATENCY_MS);
    const clean = normalize(input);

    const userErr = validateUsername(clean.username);
    if (userErr) return { ok: false, error: userErr };
    const msgErr = validateMessage(clean.text);
    if (msgErr) return { ok: false, error: msgErr };
    if (containsProfanity(clean.text))
      return { ok: false, error: "Mesaj uygun olmayan içerik içeriyor." };
    if (!BEACHES.includes(clean.beach))
      return { ok: false, error: "Geçersiz sahil seçimi." };

    const post: BeachPost = {
      id: uuid(),
      username: clean.username,
      text: clean.text,
      beach: clean.beach,
      created_at: new Date().toISOString(),
    };
    // Newest first.
    this.posts = [post, ...this.posts];
    return { ok: true, post: clone(post) };
  }

  /**
   * In mock mode there is no real backend, so this is a no-op.
   * This is deliberate and honest: the UI still renders the realtime
   * capsule affordance, but won't fabricate posts.
   */
  subscribeToInserts(_onInsert: (post: BeachPost) => void): () => void {
    return () => {};
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/* ─── Supabase repository (dormant) ───────────────────────────── */

class SupabaseCommunityRepository implements CommunityRepository {
  // Resolved on each call; getSupabase() is cached internally.
  private async client() {
    const sb = await getSupabase();
    if (!sb) throw new Error("Supabase client unavailable");
    return sb;
  }

  async fetchPosts(limit: number = VALIDATION.initialPageSize): Promise<BeachPost[]> {
    const sb = await this.client();
    const { data, error } = await sb
      .from("beach_posts")
      .select("id, username, text, beach, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as BeachPost[];
  }

  async createPost(input: NewPostInput): Promise<CreatePostResult> {
    const clean = normalize(input);
    const userErr = validateUsername(clean.username);
    if (userErr) return { ok: false, error: userErr };
    const msgErr = validateMessage(clean.text);
    if (msgErr) return { ok: false, error: msgErr };
    if (containsProfanity(clean.text))
      return { ok: false, error: "Mesaj uygun olmayan içerik içeriyor." };
    if (!BEACHES.includes(clean.beach))
      return { ok: false, error: "Geçersiz sahil seçimi." };

    try {
      const sb = await this.client();
      const { data, error } = await sb
        .from("beach_posts")
        .insert({ username: clean.username, text: clean.text, beach: clean.beach })
        .select("id, username, text, beach, created_at")
        .single();
      if (error) throw error;
      if (!data) return { ok: false, error: "Paylaşım oluşturulamadı." };
      return { ok: true, post: data };
    } catch (e) {
      return { ok: false, error: "Bağlantı kurulamadı. Tekrar dene." };
    }
  }

  subscribeToInserts(onInsert: (post: BeachPost) => void): () => void {
    let active = true;
    let channel: { unsubscribe(): void } | null = null;

    // Subscribe asynchronously once the lazy client resolves.
    (async () => {
      const sb = await getSupabase();
      if (!sb || !active) return;
      const sub = sb
        .channel("beach_posts_inserts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "beach_posts" },
          (payload) => onInsert(payload.new as BeachPost)
        )
        .subscribe();
      channel = sub;
    })();

    return () => {
      active = false;
      channel?.unsubscribe();
    };
  }
}

/* ─── Factory (single switch point) ───────────────────────────── */

let cachedRepo: CommunityRepository | null = null;
let mockRepo: MockCommunityRepository | null = null;

/**
 * Returns the active repository.
 *
 * Selection rule:
 *   - If NEXT_PUBLIC_SUPABASE_URL + ANON_KEY are set AND the package
 *     loads → SupabaseCommunityRepository (live data + realtime).
 *   - Otherwise → MockCommunityRepository (in-memory seed data).
 *
 * Because the selection is async (the Supabase client is lazy-loaded),
 * we resolve once and cache. Mock mode is returned synchronously to
 * avoid a loading flicker on first paint.
 */
export async function getCommunityRepository(): Promise<CommunityRepository> {
  if (cachedRepo) return cachedRepo;

  const sb = await getSupabase();
  if (sb) {
    cachedRepo = new SupabaseCommunityRepository();
  } else {
    if (!mockRepo) mockRepo = new MockCommunityRepository();
    cachedRepo = mockRepo;
  }
  return cachedRepo;
}
