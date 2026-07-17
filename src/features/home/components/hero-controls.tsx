"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_AUTOPLAY_MS } from "./hero-banner";

interface HeroControlsProps {
  activeIndex: number;
  onGoTo: (index: number) => void;
}

/** Desktop-only — mobile uses `HeroMobileOverlay` instead (see HeroBanner).
 * Arrows + timed progress bar + slide counter, clustered bottom-right next
 * to the reels-style thumbnail card. The thumbnail row itself lives in
 * `HeroCards` (it's the same element that morphs into the active card), so
 * this component is just the "chrome" layer on top of it. */
export function HeroControls({ activeIndex, onGoTo }: HeroControlsProps) {
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
        {/* Keyed on activeIndex so it remounts and restarts from 0% on every
         * slide change — auto-advance and manual clicks alike. */}
        <motion.div
          key={activeIndex}
          className="h-full bg-brand"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: HERO_AUTOPLAY_MS / 1000, ease: "linear" }}
        />
      </div>
      <span className="shrink-0 text-[40px] font-bold text-white/70">
        {String(activeIndex + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
