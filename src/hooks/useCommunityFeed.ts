"use client";

/* ═══════════════════════════════════════════════════════════════
   useCommunityFeed — the single source of truth for the feed UI
   ───────────────────────────────────────────────────────────────
   Responsibilities:
     • Resolve + hold the active repository (mock or supabase)
     • Load the initial page of posts
     • Subscribe to realtime INSERTs — OTHER people's posts land in
       `pendingPosts` (the "new posts arrived" capsule), NOT the list,
       so the list never jumps while someone is reading.
     • addPost() — the CURRENT USER's own post is prepended directly
       (it's expected, so no capsule).
     • Enforce a 30s rate limit (state + localStorage mirror)
     • Expose retry()

   The hook never throws. Errors land in `status: 'error'`.
   ═══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from "react";
import {
  type BeachPost,
  type NewPostInput,
  VALIDATION,
} from "@/types/community";
import {
  getCommunityRepository,
  canPostAgain,
  rateLimitRemainingSec,
} from "@/lib/community";

export type FeedStatus = "loading" | "ready" | "error";

export type AddPostResult =
  | { ok: true; post: BeachPost }
  | { ok: false; error: string };

const LAST_POST_KEY = "moq_sahilin_nabzi_last_post_at";

function readLastPostAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_POST_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function useCommunityFeed() {
  const [posts, setPosts] = useState<BeachPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BeachPost[]>([]);
  const [status, setStatus] = useState<FeedStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [lastPostAt, setLastPostAt] = useState<number | null>(null);
  const [rateRemaining, setRateRemaining] = useState(0);

  // ── Initial load + realtime subscription ─────────────────────
  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const repo = await getCommunityRepository();
      const data = await repo.fetchPosts(VALIDATION.initialPageSize);
      setPosts(data);
      setStatus("ready");
    } catch (e) {
      console.warn("[useCommunityFeed] load failed", e);
      setError("Bağlantı kurulamadı. Tekrar dene.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Realtime subscription ────────────────────────────────────
  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    (async () => {
      const repo = await getCommunityRepository();
      if (cancelled) return;
      unsubscribe = repo.subscribeToInserts((post) => {
        // Dedupe: ignore if already visible or already pending.
        setPosts((curr) => {
          if (curr.some((p) => p.id === post.id)) return curr;
          setPendingPosts((pend) =>
            pend.some((p) => p.id === post.id) ? pend : [post, ...pend]
          );
          return curr;
        });
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // ── Reveal capsule → move pending into the list ──────────────
  const revealPending = useCallback(() => {
    setPendingPosts((pend) => {
      if (pend.length === 0) return pend;
      setPosts((curr) => [...pend, ...curr]);
      return [];
    });
  }, []);

  // ── Add the current user's own post ──────────────────────────
  const addPost = useCallback(
    async (input: NewPostInput): Promise<AddPostResult> => {
      // Rate limit (frontend-only, per the plan).
      const now = Date.now();
      if (!canPostAgain(lastPostAt, now)) {
        return {
          ok: false,
          error: `Çok hızlı! ${rateLimitRemainingSec(lastPostAt, now)} saniye sonra tekrar dene.`,
        };
      }

      try {
        const repo = await getCommunityRepository();
        const result = await repo.createPost(input);
        if (!result.ok) return result;

        // Own post → prepend directly (expected, no capsule).
        setPosts((curr) => {
          if (curr.some((p) => p.id === result.post.id)) return curr;
          return [result.post, ...curr];
        });

        const ts = Date.now();
        setLastPostAt(ts);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LAST_POST_KEY, String(ts));
        }
        return { ok: true, post: result.post };
      } catch (e) {
        console.warn("[useCommunityFeed] addPost failed", e);
        return { ok: false, error: "Bağlantı kurulamadı. Tekrar dene." };
      }
    },
    [lastPostAt]
  );

  // ── Rate-limit clock + bootstrap from localStorage ───────────
  useEffect(() => {
    setLastPostAt(readLastPostAt());
  }, []);

  useEffect(() => {
    if (!lastPostAt) {
      setRateRemaining(0);
      return;
    }
    const tick = () => setRateRemaining(rateLimitRemainingSec(lastPostAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lastPostAt]);

  const canPost = canPostAgain(lastPostAt);

  return {
    posts,
    pendingPosts,
    status,
    error,
    canPost,
    rateRemaining,
    addPost,
    revealPending,
    retry: load,
  };
}
