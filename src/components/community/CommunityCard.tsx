"use client";

/* ═══════════════════════════════════════════════════════════════
   CommunityCard — a single memory on the wall
   ───────────────────────────────────────────────────────────────
   Calm by design (per the UX spec): white card, very subtle hover
   (translateY -2px + soft shadow), no scale, no gleam. Content first.
   Long messages clamp to 3 lines with a "Devamını oku" toggle.
   ═══════════════════════════════════════════════════════════════ */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { BeachPost } from "@/types/community";
import { formatRelativeTime } from "@/lib/community";

// A small, fixed set of avatars — picked deterministically from the id.
const AVATARS = ["🌊", "🏄", "☀️", "🏖️", "🐚", "🌴", "🦀", "⚓"];

function avatarFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length];
}

export default function CommunityCard({
  post,
  index = 0,
}: {
  post: BeachPost;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="
        group bg-white/85 backdrop-blur-sm
        border border-black/[0.06]
        rounded-2xl
        shadow-[0_4px_20px_rgba(26,37,60,0.04)]
        hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(26,37,60,0.08)]
        transition-all duration-[var(--duration-hover)] ease-moq
        px-5 py-4 md:px-6 md:py-5
      "
    >
      {/* Header: avatar + username + meta */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-blue-bg flex items-center justify-center text-sm md:text-base select-none"
          aria-hidden
        >
          {avatarFor(post.id)}
        </span>
        <span className="font-black text-sm md:text-[15px] text-brand-navy tracking-tight">
          {post.username}
        </span>
        <span className="ml-auto text-[11px] md:text-xs text-brand-slate font-medium whitespace-nowrap tabular-nums">
          🕒 {formatRelativeTime(post.created_at)}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.05] mb-2.5" />

      {/* Body */}
      <p
        className={
          "text-[14px] md:text-[15px] leading-relaxed text-brand-navy/90 font-medium whitespace-pre-wrap break-words " +
          (expanded ? "" : "line-clamp-3")
        }
      >
        {post.text}
      </p>

      {/* Expand toggle — only meaningful when clamped.
          We rely on CSS line-clamp; show toggle when text is long or has many newlines. */}
      {(post.text.length > 140 || post.text.split("\n").length > 3) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-xs font-bold text-brand-blue-text hover:text-brand-blue-text/80 transition-colors cursor-pointer"
        >
          {expanded ? "Daha az" : "Devamını oku"}
        </button>
      )}
    </motion.div>
  );
}
