"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { type BeachPost } from "@/types/community";

export default function BeachPulseWidget() {
  const [latestPosts, setLatestPosts] = useState<BeachPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BeachPost | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function initFeed() {
      const { getCommunityRepository } = await import("@/lib/community");
      const repo = await getCommunityRepository();
      
      // Load initial 3 posts
      const posts = await repo.fetchPosts(3);
      setLatestPosts(posts);

      // Subscribe to live inserts
      unsubscribe = repo.subscribeToInserts((newPost) => {
        setLatestPosts((prev) => {
          return [newPost, ...prev].slice(0, 3);
        });
      });
    }

    initFeed().catch(console.error);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleScrollToPulse = () => {
    document.getElementById("sahilin-nabzi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[280px] bg-white/75 backdrop-blur-md p-5 rounded-[2rem] border border-white/50 shadow-[0_15px_40px_rgba(26,37,60,0.08)] flex flex-col space-y-3"
      >
        {/* Header row */}
        <div className="flex justify-between items-center pb-1.5 border-b border-brand-navy/5">
          <span className="text-[10px] font-black text-brand-navy tracking-widest uppercase">
            SAHİLİN NABZI
          </span>
          <div className="flex items-center space-x-1.5 text-[9px] font-bold text-emerald-600 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CANLI</span>
          </div>
        </div>

        {/* Recent Live Messages List */}
        <div className="flex flex-col space-y-2 py-1">
          {latestPosts.length === 0 ? (
            <div className="text-[10px] text-brand-slate italic text-center py-6">
              Henüz paylaşım yok...
            </div>
          ) : (
            latestPosts.map((post) => (
              <div 
                key={post.id} 
                className="flex flex-col items-start text-left bg-white/40 p-2.5 rounded-2xl border border-white/40 space-y-0.5 relative group hover:bg-white/70 transition-colors duration-200"
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-[8px] font-black text-brand-navy">@{post.username}</span>
                  <button 
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="text-[7.5px] font-black text-brand-blue-text hover:underline cursor-pointer"
                  >
                    Oku
                  </button>
                </div>
                <p className="text-[9.5px] text-brand-slate line-clamp-1 leading-relaxed w-full overflow-hidden">
                  {post.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-1">
          <button
            onClick={handleScrollToPulse}
            className="w-full bg-[#1a253c] hover:bg-brand-blue-text text-[#fdf7f4] hover:text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <span>TÜM POSTLAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* ── Detail Modal for Full Comments ────────────────── */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-brand-navy/30 backdrop-blur-md flex items-center justify-center z-[99999] p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-[340px] bg-white p-6 rounded-[2rem] border border-white/80 shadow-2xl flex flex-col space-y-4 text-left relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-brand-navy">@{selectedPost.username}</span>
                  <span className="text-[9px] font-bold text-brand-slate uppercase tracking-wider">📍 Başiskele Sahili</span>
                </div>
                <span className="text-[9px] font-bold text-brand-slate">
                  {new Date(selectedPost.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="text-xs text-brand-navy leading-relaxed font-medium bg-brand-slate/5 p-4 rounded-xl border border-brand-navy/5 max-h-[160px] overflow-y-auto custom-scrollbar">
                {selectedPost.text}
              </p>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="w-full bg-[#1a253c] hover:bg-brand-blue-text text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-2xl shadow-md transition-all duration-300 cursor-pointer"
              >
                KAPAT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
