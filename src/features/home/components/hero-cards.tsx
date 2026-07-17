"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { cn } from "@/utils/cn";
import type { HeroItem } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

const THUMB_WIDTH = 117.984;
const THUMB_HEIGHT = 195.928;
const THUMB_GAP = 12;
const THUMB_RIGHT = 32;
const THUMB_BOTTOM = 108;

interface HeroCardsProps {
  items: HeroItem[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

/** Desktop-only — mobile uses `HeroMobileOverlay` instead (see HeroBanner).
 * One persistent `motion.div` per item, mapped in stable array order — only
 * its position/size (full-bleed vs thumbnail slot) changes between renders.
 * Framer's `layout` prop diffs that automatically into a FLIP transform, so
 * the active card visibly shrinks into its thumbnail slot and the newly
 * active thumbnail grows to fill the stage, no manual keyframes needed. */
export function HeroCards({ items, activeIndex, onGoTo }: HeroCardsProps) {
  const restOrder = items.map((_, i) => i).filter((i) => i !== activeIndex);

  return (
    <>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const restIndex = restOrder.indexOf(index);

        return (
          <motion.div
            key={item.id}
            layout
            transition={{ layout: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
            onClick={() => !isActive && onGoTo(index)}
            className={cn(
              "absolute overflow-hidden",
              isActive ? "z-0" : "z-30 cursor-pointer opacity-70 hover:opacity-100"
            )}
            style={
              isActive
                ? { inset: 0, borderRadius: 0 }
                : {
                    right: THUMB_RIGHT + restIndex * (THUMB_WIDTH + THUMB_GAP),
                    bottom: THUMB_BOTTOM,
                    width: THUMB_WIDTH,
                    height: THUMB_HEIGHT,
                    borderRadius: 12,
                  }
            }
          >
            <Image
              src={resolveImageSrc(item.poster || item.backdrop, PLACEHOLDER_IMAGE)}
              alt={item.title}
              fill
              sizes={isActive ? "100vw" : "118px"}
              priority={isActive}
              quality={90}
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </>
  );
}
