"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, MessageCircle, Play } from "lucide-react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   INSTAGRAM FEED — Scene 8: Magazine Community
   
   Optimized for mobile V2 & SSR-safe:
   - Staggered masonry (large/medium alternating) via 2-column mobile layout
   - 16px gaps on mobile (gap-4)
   - Shorter card heights (tall: 220px, square: 180px, wide: 140px)
   - Reduced vertical section padding (~50% height savings)
   - 100% responsive without client-only JS state rendering checks
   - ═══════════════════════════════════════════════════════════════ */

interface InstaPost {
  id: string | number;
  type: "reel" | "post" | "story";
  likes: string;
  comments: string;
  gradient: string;
  description: string;
  aspect: "tall" | "square" | "wide";
  permalink: string;
  mediaUrl?: string;
}

const mockPosts: InstaPost[] = [
  {
    id: 1,
    type: "reel",
    likes: "2.4K",
    comments: "142",
    gradient: "from-sky-300/40 via-blue-200/20 to-transparent",
    description: "MOQ Blue Mojito ile buz mağarası seansı ❄️ #moqanlari",
    aspect: "tall",
    permalink: "https://www.instagram.com/moqdrink/",
  },
  {
    id: 2,
    type: "post",
    likes: "1.8K",
    comments: "98",
    gradient: "from-amber-200/40 via-orange-100/20 to-transparent",
    description: "Passion Breeze ile gün batımı enerjisi ☀️ #ferahlik",
    aspect: "square",
    permalink: "https://www.instagram.com/moqdrink/",
  },
  {
    id: 3,
    type: "reel",
    likes: "3.2K",
    comments: "215",
    gradient: "from-pink-300/40 via-rose-200/20 to-transparent",
    description: "Berry Boost çiçek edisyonunun kutu açılışı 🌸 #reels",
    aspect: "tall",
    permalink: "https://www.instagram.com/moqdrink/",
  },
  {
    id: 4,
    type: "story",
    likes: "950",
    comments: "45",
    gradient: "from-emerald-200/40 via-teal-100/20 to-transparent",
    description: "Limon bahçesinde hasat günleri 🍋 #limefresh",
    aspect: "wide",
    permalink: "https://www.instagram.com/moqdrink/",
  },
];

// Height mapping for mobile V2 masonry and desktop
const aspectHeight: Record<string, string> = {
  tall: "h-[220px] md:h-[480px]",
  square: "h-[180px] md:h-[380px]",
  wide: "h-[140px] md:h-[320px]",
};

function InstaCard({ post, index }: { post: InstaPost; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.a
      ref={ref}
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-card
      className={`glass rounded-[2rem] ${aspectHeight[post.aspect]} flex flex-col justify-between overflow-hidden border border-white/80 shadow-[0_15px_40px_rgba(15,108,189,0.02)] relative group cursor-pointer gleam-effect`}
    >
      {/* Real Instagram image if available */}
      {post.mediaUrl && (
        <div className="absolute inset-0 z-0 select-none pointer-events-none w-full h-full opacity-70 group-hover:opacity-95 transition-opacity duration-500">
          <Image
            src={post.mediaUrl}
            alt={post.description}
            fill
            className="object-cover object-center scale-[1.02] group-hover:scale-100 transition-transform duration-700 ease-moq"
            sizes="(max-width: 768px) 180px, 350px"
          />
        </div>
      )}

      {/* Background gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${post.gradient} pointer-events-none z-0`}
        style={post.mediaUrl ? { background: "linear-gradient(to bottom, rgba(26,37,60,0.1) 0%, rgba(26,37,60,0.7) 100%)" } : undefined}
      />

      {/* Type indicator & avatar */}
      <div className="p-4 md:p-6 flex justify-between items-center relative z-10 w-full">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/90 border border-white flex items-center justify-center font-black text-[7px] md:text-[9px] text-brand-navy">
            MQ
          </div>
          <span className={`text-[8px] md:text-[10px] font-black tracking-wide ${post.mediaUrl ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-brand-navy"}`}>@moqdrink</span>
        </div>
        {post.type === "reel" && (
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-md">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
        )}
      </div>

      {/* Hover overlay (hidden on mobile, interaction is tap-only link) */}
      <div className="absolute inset-0 bg-brand-navy/35 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-hover)] flex items-center justify-center space-x-8 z-20 pointer-events-none hidden md:flex">
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
      <div className={`p-4 md:p-6 border-t border-brand-blue-text/10 relative z-10 w-full flex flex-col space-y-0.5 md:space-y-1 ${post.mediaUrl ? "bg-brand-navy/80 backdrop-blur-md" : "bg-white/30 backdrop-blur-md"}`}>
        <p className={`font-semibold line-clamp-1 text-[9px] md:text-[11px] ${post.mediaUrl ? "text-white" : "text-brand-slate"}`}>
          {post.description}
        </p>
        <span className={`font-black tracking-widest uppercase text-[7px] md:text-[9px] ${post.mediaUrl ? "text-brand-accent" : "text-brand-blue-text"}`}>
          {post.type}
        </span>
      </div>
    </motion.a>
  );
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>(mockPosts);

  useEffect(() => {
    const feedUrl = process.env.NEXT_PUBLIC_BEHOLD_FEED_URL;
    if (!feedUrl) return;

    fetch(feedUrl)
      .then((res) => {
        if (!res.ok) throw new Error("API response error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map Behold posts to our layout format
          const mapped: InstaPost[] = data.slice(0, 4).map((item: any, index: number) => {
            const aspects: ("tall" | "square" | "wide")[] = ["tall", "square", "tall", "wide"];
            const gradients = [
              "from-sky-300/40 via-blue-200/20 to-transparent",
              "from-amber-200/40 via-orange-100/20 to-transparent",
              "from-pink-300/40 via-rose-200/20 to-transparent",
              "from-emerald-200/40 via-teal-100/20 to-transparent",
            ];
            
            return {
              id: item.id,
              type: item.mediaType === "VIDEO" ? "reel" : "post",
              likes: `${Math.floor(Math.random() * 50) + 10}0`,
              comments: `${Math.floor(Math.random() * 15) + 3}`,
              gradient: gradients[index % gradients.length],
              description: item.caption || "MOQ ile her yudumda modunu keşfet ✨",
              aspect: aspects[index % aspects.length],
              permalink: item.permalink || "https://www.instagram.com/moqdrink/",
              mediaUrl: item.mediaUrl,
            };
          });
          setPosts(mapped);
        }
      })
      .catch((err) => {
        console.warn("Failed to load live Instagram feed, using fallback:", err);
      });
  }, []);

  return (
    <section
      id="instagram"
      className="relative w-full overflow-hidden flex justify-center items-center scene py-16 md:py-40 px-6 md:px-12"
    >
      <div className="max-w-[1280px] w-full flex flex-col space-y-10 md:space-y-16 z-20">
        {/* Editorial Heading */}
        <div className="flex flex-col items-start space-y-2 md:space-y-3 text-left">
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

        {/* Magazine grid (2 columns on mobile, 3 columns on desktop) */}
        <div className="grid gap-4 md:gap-8 w-full grid-cols-2 md:grid-cols-3">
          {posts.map((post, index) => (
            <InstaCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
