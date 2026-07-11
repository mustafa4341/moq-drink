"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ═══════════════════════════════════════════════════════════════
   PHILOSOPHY — Scene 7: The Soul
   
   Optimized for mobile V2:
   - Compact alternating alignment (odd: left, even: right) on mobile
   - Card height compressed to 220px-260px on mobile
   - Smaller padding and typography on mobile devices
   - 100% identical grid layout on desktop
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

function PhilosophyCard({ item, index, isMobile }: { item: PhilosophyItem; index: number; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isOdd = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={isMobile ? undefined : { y: -8 }}
      whileTap={isMobile ? { scale: 0.99 } : undefined}
      data-card
      className={`glass rounded-[2rem] border border-white/80 shadow-[0_15px_40px_rgba(15,108,189,0.02)] relative overflow-hidden gleam-effect card-hover cursor-default flex flex-col justify-between transition-all duration-300
        ${isMobile 
          ? `p-5 h-[230px] ${isOdd ? "text-left items-start mr-8" : "text-right items-end ml-8"}` 
          : "p-10 min-h-[380px] text-left"
        }
      `}
    >
      <div className={`flex flex-col ${isMobile ? "space-y-1.5" : "space-y-4"}`}>
        <span className={`font-black tracking-widest text-brand-blue-text uppercase ${isMobile ? "text-[8px]" : "text-[9px]"}`}>
          {item.tagline}
        </span>
        <h3 className={`font-black tracking-wide text-brand-navy font-sans uppercase ${isMobile ? "text-xl" : "text-3xl"}`}>
          {item.title}
        </h3>
      </div>

      <p className={`font-semibold text-brand-slate leading-relaxed border-t border-brand-blue-text/10 
        ${isMobile ? "text-[11px] pt-3 mt-2" : "text-sm pt-6"}`}
      >
        {item.description}
      </p>
    </motion.div>
  );
}

export default function Philosophy() {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return (
      <section id="philosophy" className="relative py-20 w-full overflow-hidden px-6 flex justify-center items-center scene min-h-[250px]" />
    );
  }

  return (
    <section
      id="philosophy"
      className="relative w-full overflow-hidden flex justify-center items-center scene py-16 md:py-40 px-6 md:px-12"
    >
      <div className="max-w-[1280px] w-full flex flex-col space-y-10 md:space-y-16 z-20">
        {/* Editorial Heading */}
        <div className="flex flex-col items-start space-y-2 md:space-y-3 text-left">
          <span className="type-label text-brand-blue-text">
            MOQ FELSEFESİ
          </span>
          <h2 className="type-scene-title text-brand-navy font-sans">
            FELSEFEMİZ
          </h2>
        </div>

        {/* Philosophy Cards layout (vertical list for mobile, grid for desktop) */}
        <div className={`grid w-full gap-6 md:gap-10 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          {philosophyItems.map((item, index) => (
            <PhilosophyCard key={item.id} item={item} index={index} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}
