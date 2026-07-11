"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   PHILOSOPHY — Scene 7: The Soul
   
   Optimized for mobile V2 & SSR-safe:
   - Alternating alignments on mobile, standard grid on desktop via CSS
   - Zero hydration mismatch: uses purely responsive Tailwind classes
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
      whileHover={{ y: -8, boxShadow: "0 20px 45px rgba(15,108,189,0.06)" }}
      data-card
      className={`glass rounded-[2rem] border border-white/80 shadow-[0_15px_40px_rgba(15,108,189,0.02)] relative overflow-hidden gleam-effect cursor-default flex flex-col justify-between
        p-5 md:p-10 h-[230px] md:min-h-[380px]
        ${isOdd 
          ? "text-left items-start mr-8 md:mr-0 md:text-left md:items-start" 
          : "text-right items-end ml-8 md:ml-0 md:text-left md:items-start"
        }
      `}
    >
      <div className="flex flex-col space-y-1.5 md:space-y-4">
        <span className="font-black tracking-widest text-brand-blue-text uppercase text-[8px] md:text-[9px]">
          {item.tagline}
        </span>
        <h3 className="font-black tracking-wide text-brand-navy font-sans uppercase text-xl md:text-3xl">
          {item.title}
        </h3>
      </div>

      <p className="font-semibold text-brand-slate leading-relaxed border-t border-brand-blue-text/10 text-[11px] md:text-sm pt-3 mt-2 md:pt-6 md:mt-0">
        {item.description}
      </p>
    </motion.div>
  );
}

export default function Philosophy() {
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
        <div className="grid w-full gap-6 md:gap-10 grid-cols-1 md:grid-cols-3">
          {philosophyItems.map((item, index) => (
            <PhilosophyCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
