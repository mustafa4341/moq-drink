"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, MessageCircle, Play } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   INSTAGRAM FEED — Scene 8: Magazine Community
   
   Title: "Join the MOQ Community"
   Magazine-style layout: Varied card sizes (2:3, 1:1, 3:2)
   Hover: Zoom (scale 1.05, 250ms), reflection sweep, lift, glass overlay
   Premium magazine feel — not an Instagram embed
   ═══════════════════════════════════════════════════════════════ */

interface InstaPost {
  id: number;
  type: "reel" | "post" | "story";
  likes: string;
  comments: string;
  gradient: string;
  description: string;
  /** Aspect ratio variant for magazine layout */
  aspect: "tall" | "square" | "wide";
}

const instaPosts: InstaPost[] = [
  {
    id: 1,
    type: "reel",
    likes: "2.4K",
    comments: "142",
    gradient: "from-sky-300/40 via-blue-200/20 to-transparent",
    description: "MOQ Blue Mojito ile buz mağarası seansı ❄️ #moqanlari",
    aspect: "tall",
  },
  {
    id: 2,
    type: "post",
    likes: "1.8K",
    comments: "98",
    gradient: "from-amber-200/40 via-orange-100/20 to-transparent",
    description: "Passion Breeze ile gün batımı enerjisi ☀️ #ferahlik",
    aspect: "square",
  },
  {
    id: 3,
    type: "reel",
    likes: "3.2K",
    comments: "215",
    gradient: "from-pink-300/40 via-rose-200/20 to-transparent",
    description: "Berry Boost çiçek edisyonunun kutu açılışı 🌸 #reels",
    aspect: "tall",
  },
  {
    id: 4,
    type: "story",
    likes: "950",
    comments: "45",
    gradient: "from-emerald-200/40 via-teal-100/20 to-transparent",
    description: "Limon bahçesinde hasat günleri 🍋 #limefresh",
    aspect: "wide",
  },
];

// Height mapping for magazine layout
const aspectHeight: Record<string, string> = {
  tall: "h-[420px] md:h-[480px]",
  square: "h-[320px] md:h-[380px]",
  wide: "h-[280px] md:h-[320px]",
};

function InstaCard({ post, index }: { post: InstaPost; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.a
      ref={ref}
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      data-card
      className={`glass rounded-[2rem] ${aspectHeight[post.aspect]} flex flex-col justify-between overflow-hidden border border-white/80 shadow-[0_15px_40px_rgba(15,108,189,0.02)] relative group cursor-pointer gleam-effect`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${post.gradient} pointer-events-none z-0`} />

      {/* Type indicator & avatar */}
      <div className="p-6 flex justify-between items-center relative z-10 w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/80 border border-white flex items-center justify-center font-black text-[9px] text-brand-navy">
            MQ
          </div>
          <span className="text-[10px] font-black text-brand-navy tracking-wide">@moqdrink</span>
        </div>
        {post.type === "reel" && (
          <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-md">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand-navy/30 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-hover)] flex items-center justify-center space-x-8 z-20 pointer-events-none">
        <div className="flex items-center space-x-2 text-white font-black text-sm">
          <Heart className="w-5 h-5 fill-current" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center space-x-2 text-white font-black text-sm">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{post.comments}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-brand-blue-text/10 bg-white/30 backdrop-blur-md relative z-10 w-full flex flex-col space-y-1">
        <p className="text-[11px] font-semibold text-brand-slate line-clamp-1">
          {post.description}
        </p>
        <span className="text-[9px] font-black tracking-widest text-brand-blue-text uppercase">
          {post.type}
        </span>
      </div>
    </motion.a>
  );
}

export default function InstagramFeed() {
  return (
    <section
      id="instagram"
      className="relative py-40 w-full overflow-hidden px-6 md:px-12 flex justify-center items-center scene"
    >
      <div className="max-w-[1280px] w-full flex flex-col space-y-16 z-20">
        {/* Editorial Heading */}
        <div className="flex flex-col items-start space-y-3 text-left">
          <span className="type-label text-brand-blue-text">
            SOSYAL TOPLULUK
          </span>
          <h2 className="type-scene-title text-brand-navy font-sans">
            MOQ TOPLULUĞUNA KATILIN
          </h2>
          <p className="type-body text-brand-slate max-w-md">
            Bizim dünyamız sadece bir şişede değil. #moqdrink etiketiyle kendi modunu paylaş.
          </p>
        </div>

        {/* Magazine grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {instaPosts.map((post, index) => (
            <InstaCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
