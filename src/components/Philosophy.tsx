"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   PHILOSOPHY — Scene 7: The Soul
   
   Three premium glass cards: Fresh, Original, Together
   - Card size: min-height 380px, generous whitespace
   - Hover: Soft glow (250ms), reflection sweep (3s), lift (-8px), subtle float
   - Large whitespace above and below (py-40)
   - Scroll-triggered staggered entrance (cards fade in one by one, 200ms stagger)
   - Very calm atmosphere — minimal, almost zen
   ═══════════════════════════════════════════════════════════════ */

interface PhilosophyItem {
  id: number;
  title: string;
  tagline: string;
  description: string;
}

const philosophyItems: PhilosophyItem[] = [
  {
    id: 1,
    title: "TAZE",
    tagline: "DOĞAL AROMALAR",
    description:
      "Sadece taze meyveler, el yapımı özler ve canlandırıcı nane yaprakları. Doğallıktan ödün vermeden her yudumda saf bir ferahlık.",
  },
  {
    id: 2,
    title: "ÖZGÜN",
    tagline: "BENZERSİZ TARİFLER",
    description:
      "Alışılmış içeceklerin ötesinde, kendi modunuzu yansıtacak özel formüller. Karakteri olan tatlar, benzersiz deneyimler.",
  },
  {
    id: 3,
    title: "BİRLİKTE",
    tagline: "ORTAK ANLAR",
    description:
      "Her bardak bir paylaşım, her an bir hikaye. Sosyal dünyamızın bir parçası ol, anlarını MOQ ile tatlandır.",
  },
];

function PhilosophyCard({ item, index }: { item: PhilosophyItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      data-card
      className="glass rounded-[2rem] p-10 flex flex-col justify-between min-h-[380px] border border-white/80 shadow-[0_15px_40px_rgba(15,108,189,0.02)] relative overflow-hidden gleam-effect card-hover cursor-default"
    >
      <div className="flex flex-col space-y-4">
        <span className="text-[9px] font-black tracking-widest text-brand-blue-text uppercase">
          {item.tagline}
        </span>
        <h3 className="text-3xl font-black tracking-wide text-brand-navy font-sans uppercase">
          {item.title}
        </h3>
      </div>

      <p className="text-sm font-semibold text-brand-slate leading-relaxed pt-6 border-t border-brand-blue-text/10">
        {item.description}
      </p>
    </motion.div>
  );
}

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative py-40 w-full overflow-hidden px-6 md:px-12 flex justify-center items-center scene"
    >
      <div className="max-w-[1280px] w-full flex flex-col space-y-16 z-20">
        {/* Editorial Heading */}
        <div className="flex flex-col items-start space-y-3 text-left">
          <span className="type-label text-brand-blue-text">
            MOQ FELSEFESİ
          </span>
          <h2 className="type-scene-title text-brand-navy font-sans">
            FELSEFEMİZ
          </h2>
        </div>

        {/* 3 Glass Cards with staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {philosophyItems.map((item, index) => (
            <PhilosophyCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
