"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { HeroSlideNumber } from "./hero-slide-number";

interface HeroControlsProps {
  activeIndex: number;
  total: number;
  onGoTo: (index: number) => void;
}

/** Desktop-only — mobile uses `HeroMobileOverlay` instead (see HeroBanner).
 * Arrows + deck-progress bar + rolling slide counter, clustered bottom-right
 * next to the reels-style thumbnail card. The thumbnail row itself lives in
 * `HeroCards` (it's the same element that morphs into the active card), so
 * this component is just the "chrome" layer on top of it.
 *
 * The per-slide countdown now lives in the full-width `HeroIndicator` strip
 * at the top of the hero (ported from the reference's `.indicator`); this
 * bar instead mirrors the reference's `.progress-sub-foreground` — how far
 * through the deck the active slide is, not a timer. */
export function HeroControls({ activeIndex, total, onGoTo }: HeroControlsProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(progressRef.current, {
        width: `${((activeIndex + 1) / total) * 100}%`,
        duration: 0.6,
        ease: "sine.inOut",
      });
    },
    { dependencies: [activeIndex, total], scope: progressRef }
  );

  return (
    <div className="absolute right-8 bottom-12 z-30 flex items-center gap-3">
      <motion.button
        type="button"
        onClick={() => onGoTo(activeIndex - 1)}
        aria-label="Phim trước"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex shrink-0"
      >
        <Image src="/image/ic_left.png" alt="" width={48} height={48} />
      </motion.button>
      <motion.button
        type="button"
        onClick={() => onGoTo(activeIndex + 1)}
        aria-label="Phim tiếp theo"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex shrink-0"
      >
        <Image src="/image/ic_right.png" alt="" width={48} height={48} />
      </motion.button>

      <div className="h-1 w-120 overflow-hidden rounded-full bg-white/20">
        <div ref={progressRef} className="h-full w-0 bg-brand" />
      </div>

      <HeroSlideNumber activeIndex={activeIndex} total={total} />
    </div>
  );
}
