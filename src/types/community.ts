/* ═══════════════════════════════════════════════════════════════
   Sahilin Nabzı — Shared Types & Constants
   ───────────────────────────────────────────────────────────────
   This is the single source of truth for the community feed's data
   contract. The UI (components) and the data layer (lib/community.ts)
   both import from here, so swapping the Mock repository for the
   Supabase repository never touches the UI.

   Repository Pattern:
     CommunitySection → useCommunityFeed → CommunityRepository
                                                │
                                   ┌────────────┴────────────┐
                                   ▼                         ▼
                         MockCommunityRepository   SupabaseCommunityRepository
   ═══════════════════════════════════════════════════════════════ */

export const BEACHES = [
  "Başiskele",
] as const;

export type Beach = (typeof BEACHES)[number];

/** "all" is only used for client-side view filtering, never stored. */
export type BeachFilter = Beach | "all";

/** A single community post, as returned by the repository. */
export interface BeachPost {
  id: string;
  username: string;
  text: string;
  beach: Beach;
  created_at: string; // ISO 8601 timestamp
}

/** Input shape for creating a new post (no id / created_at yet). */
export interface NewPostInput {
  username: string;
  text: string;
  beach: Beach;
}

/** Result of a createPost attempt — never throws, always returns a result. */
export type CreatePostResult =
  | { ok: true; post: BeachPost }
  | { ok: false; error: string };

/**
 * The abstraction both Mock and Supabase data sources implement.
 * The hook (useCommunityFeed) depends ONLY on this interface, so the
 * underlying backend can change without touching any UI code.
 */
export interface CommunityRepository {
  /** Load the most recent posts, newest first. */
  fetchPosts(limit?: number): Promise<BeachPost[]>;
  /** Validate + persist a new post. Returns the created post or an error. */
  createPost(input: NewPostInput): Promise<CreatePostResult>;
  /**
   * Subscribe to new INSERT events only (per the implementation plan —
   * UPDATE/DELETE are intentionally ignored).
   * Returns an unsubscribe function.
   */
  subscribeToInserts(onInsert: (post: BeachPost) => void): () => void;
}

/** Validation rules, centralized so UI + repository agree. */
export const VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 20,
    /** letters, numbers, underscore; no leading/trailing spaces */
    pattern: /^[A-Za-z0-9_]+$/,
  },
  message: {
    minLength: 5,
    maxLength: 220,
  },
  /** Minimum seconds between two posts from the same browser (rate limit). */
  rateLimitSeconds: 30,
  /** How many posts to load initially. */
  initialPageSize: 20,
} as const;
