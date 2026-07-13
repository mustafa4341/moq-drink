"use client";

/* ═══════════════════════════════════════════════════════════════
   CommunityFeed — the list of memories + all non-composer states
   ───────────────────────────────────────────────────────────────
   Renders:
     • realtime capsule ("Yeni paylaşım geldi") above the list
     • beach filter pills (Tümü / Fıstıklı / ...) — client-side view
     • loading skeletons
     • empty state
     • error state + retry
     • the staggered card list (newest first)
   ═══════════════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, RefreshCw, ChevronUp } from "lucide-react";
import type { BeachPost, BeachFilter } from "@/types/community";
import { BEACHES } from "@/types/community";
import CommunityCard from "./CommunityCard";

interface Props {
  posts: BeachPost[];
  pendingPosts: BeachPost[];
  status: "loading" | "ready" | "error";
  error: string | null;
  onRevealPending: () => void;
  onRetry: () => void;
}

export default function CommunityFeed({
  posts,
  pendingPosts,
  status,
  error,
  onRevealPending,
  onRetry,
}: Props) {
  const [activeBeach, setActiveBeach] = useState<BeachFilter>("all");

  // Only beaches that actually appear in the current feed are offered.
  const availableBeaches = useMemo(() => {
    const present = new Set(posts.map((p) => p.beach));
    return BEACHES.filter((b) => present.has(b));
  }, [posts]);

  const visiblePosts = useMemo(
    () =>
      activeBeach === "all"
        ? posts
        : posts.filter((p) => p.beach === activeBeach),
    [posts, activeBeach]
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* Realtime capsule — doesn't shift the list while reading */}
      <AnimatePresence>
        {pendingPosts.length > 0 && (
          <motion.button
            key="capsule"
            type="button"
            onClick={onRevealPending}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="
              self-center inline-flex items-center gap-2
              bg-brand-blue-text text-white
              px-4 py-2 rounded-full
              shadow-[0_6px_20px_rgba(56,139,230,0.3)]
              text-xs font-bold tracking-wide cursor-pointer
              hover:brightness-105 transition
            "
          >
            <ChevronUp className="w-3.5 h-3.5" />
            {pendingPosts.length === 1
              ? "Yeni paylaşım geldi"
              : `${pendingPosts.length} yeni paylaşım`}
          </motion.button>
        )}
      </AnimatePresence>



      {/* States */}
      {status === "loading" && <Skeletons />}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6">
          <AlertCircle className="w-8 h-8 text-brand-red-text mb-3" strokeWidth={2} />
          <p className="text-sm font-semibold text-brand-navy mb-1">
            {error ?? "Bağlantı kurulamadı."}
          </p>
          <p className="text-xs text-brand-slate mb-4">Tekrar dene.</p>
          <button
            type="button"
            onClick={onRetry}
            className="
              inline-flex items-center gap-2
              bg-brand-navy text-white
              px-5 py-2.5 rounded-full
              text-xs font-bold tracking-wide cursor-pointer
              hover:bg-brand-navy/90 transition
            "
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tekrar dene
          </button>
        </div>
      )}

      {status === "ready" && visiblePosts.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-14 px-6">
          <span className="text-4xl mb-3" aria-hidden>🌊</span>
          <p className="text-sm font-bold text-brand-navy mb-1">
            Henüz kimse paylaşım yapmadı.
          </p>
          <p className="text-xs text-brand-slate">
            Bugünün ilk anısını sen bırak.
          </p>
        </div>
      )}

      {status === "ready" && visiblePosts.length > 0 && (
        <div className="flex flex-col gap-4 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {visiblePosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <CommunityCard post={post} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ─── small parts ─────────────────────────────────────────────── */

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full",
        "text-xs font-bold tracking-tight cursor-pointer transition-all duration-[var(--duration-hover)]",
        active
          ? "bg-brand-navy text-white shadow-[0_4px_14px_rgba(26,37,60,0.18)]"
          : "bg-white/70 text-brand-slate border border-black/[0.06] hover:bg-white hover:text-brand-navy",
      ].join(" ")}
    >
      {label}
      <span className={active ? "text-white/60" : "text-brand-slate/50"}>{count}</span>
    </button>
  );
}

function Skeletons() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/60 border border-black/[0.05] rounded-2xl px-5 py-4 md:px-6 md:py-5 animate-pulse"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-slate/15" />
            <div className="h-3 w-24 rounded-full bg-brand-slate/15" />
            <div className="ml-auto h-5 w-28 rounded-full bg-brand-slate/10" />
          </div>
          <div className="h-px bg-black/[0.04] mb-3" />
          <div className="h-3 w-full rounded-full bg-brand-slate/15 mb-2" />
          <div className="h-3 w-5/6 rounded-full bg-brand-slate/10" />
        </div>
      ))}
    </div>
  );
}
