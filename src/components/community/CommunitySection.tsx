"use client";

/* ═══════════════════════════════════════════════════════════════
   CommunitySection — "Sahilin Nabzı" (the living wall of memories)
   ───────────────────────────────────────────────────────────────
   Owns the useCommunityFeed hook and wires its state into the
   composer + feed. This is the section shell, slotted into page.tsx
   right after <InstagramFeed />.

   Calm, content-first section (per the UX spec): mid-size title,
   warm copy, max-w-[900px] centered, modest vertical padding so the
   section feels like a quiet board rather than a loud social feed.
   ═══════════════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import CommunityComposer from "./CommunityComposer";
import CommunityFeed from "./CommunityFeed";

export default function CommunitySection() {
  const feed = useCommunityFeed();

  return (
    <section
      id="sahilin-nabzi"
      className="relative w-full overflow-hidden flex justify-center scene pt-12 md:pt-24 pb-16 md:pb-28 px-6 md:px-12"
    >
      <div className="max-w-[900px] w-full flex flex-col gap-7 md:gap-9 z-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 md:gap-3"
        >
          <h2 className="text-3xl md:text-5xl font-black text-brand-navy tracking-tight font-sans">
            🌊 Sahilin Nabzı
          </h2>
          <p className="type-body text-brand-slate max-w-xl">
            Burada bugün yaşadığın küçük bir anı bırak. Belki yarın biri aynı
            yerde senin mesajını okuyacak.
          </p>
        </motion.header>

        {/* Composer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <CommunityComposer
            addPost={feed.addPost}
            canPost={feed.canPost}
            rateRemaining={feed.rateRemaining}
          />
        </motion.div>

        {/* Feed */}
        <CommunityFeed
          posts={feed.posts}
          pendingPosts={feed.pendingPosts}
          status={feed.status}
          error={feed.error}
          onRevealPending={feed.revealPending}
          onRetry={feed.retry}
        />
      </div>
    </section>
  );
}
