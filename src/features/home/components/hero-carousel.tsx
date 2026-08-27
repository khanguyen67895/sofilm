"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import type { HeroItem } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

interface HeroCarouselProps {
  items: HeroItem[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

/** offset (distance from the active slot) → card geometry, ported from the
 * Figma hero spec (Rectangle 34626096..100): the active slot is a full-bright
 * poster, the four side slots show the neighboring items' posters dimmed so
 * the highlight still pops. */
const SLOT_STYLE: Record<number, { width: number; height: number; radius: number }> = {
  "-2": { width: 180, height: 459, radius: 12 },
  "-1": { width: 224, height: 484, radius: 12 },
  "0": { width: 408, height: 644, radius: 20 },
  "1": { width: 224, height: 484, radius: 12 },
  "2": { width: 180, height: 459, radius: 12 },
};

/** Side cards angle away from the active poster in 3D (rotateY) so the row
 * reads as a shallow arc/coverflow instead of flat rectangles side by side —
 * the near edge (toward the center card) tilts forward, the far edge recedes. */
const ROTATE_STYLE: Record<number, number> = {
  "-2": 40,
  "-1": 28,
  "0": 0,
  "1": -28,
  "2": -40,
};

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
    >
      <Icon size={20} />
    </motion.button>
  );
}

/** The active card's poster fills the frame; when the active item has a
 * video (banner-attached or the movie's own clip), it autoplays as the
 * background instead — same behavior the old full-bleed hero gave it. */
function CardMedia({ item, width, isActive }: { item: HeroItem; width: number; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isActive) return;
    videoRef.current?.play().catch(() => {});
  }, [isActive, item.videoUrl]);

  if (isActive && item.videoUrl) {
    return (
      <video
        key={item.videoUrl}
        ref={videoRef}
        src={item.videoUrl}
        muted
        loop
        playsInline
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={resolveImageSrc(item.poster || item.backdrop, PLACEHOLDER_IMAGE)}
      alt={item.title}
      fill
      sizes={`${width}px`}
      quality={90}
      priority={isActive}
      className="object-cover"
    />
  );
}

export function HeroCarousel({ items, activeIndex, onGoTo }: HeroCarouselProps) {
  const n = items.length;
  // The full 5-card arc needs ~1600px of room (Figma's own frame width) — on
  // narrower desktop viewports drop the outer pair first, matching how
  // MovieRow/AllMoviesSection already scale down before the mobile branch.
  const isWide = useMediaQuery("(min-width: 1280px)");
  // Capped so 2*maxOffset+1 never exceeds `n` — otherwise the wrap-around
  // indices for the outer offsets collide (e.g. with 3 items, offset -2 and
  // +1 land on the same item), which used to silently drop the positive
  // side and pile every card onto the left of the active slot.
  const maxOffset = Math.min(isWide ? 2 : 1, Math.floor((n - 1) / 2));

  const visible = Array.from({ length: maxOffset * 2 + 1 }, (_, i) => i - maxOffset).map(
    (offset) => ({ offset, index: wrap(activeIndex + offset, n) })
  );

  return (
    <div
      className="relative flex items-center justify-center gap-6 px-4"
      style={{ perspective: 1400 }}
    >
      {n > 1 && <ArrowButton direction="left" onClick={() => onGoTo(activeIndex - 1)} />}

      {visible.map(({ offset, index }) => {
        const style = SLOT_STYLE[offset];
        const rotateY = ROTATE_STYLE[offset];
        const isActive = offset === 0;

        if (!isActive) {
          const item = items[index];
          return (
            <motion.div
              key={item.id}
              role="button"
              tabIndex={0}
              initial={{ opacity: 0 }}
              animate={{ width: style.width, height: style.height, opacity: 1, rotateY }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ borderRadius: style.radius }}
              onClick={() => onGoTo(index)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onGoTo(index)}
              aria-label={item.title}
              className="group relative shrink-0 cursor-pointer overflow-hidden bg-[#D9D9D9] outline-none"
            >
              <CardMedia item={item} width={style.width} isActive={false} />
              <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:bg-black/30" />

              <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 bg-linear-to-t from-black via-black/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
                {item.description && (
                  <p className="line-clamp-2 text-[11px] text-white/70">{item.description}</p>
                )}
                <Link
                  href={item.slug ? ROUTES.movie(item.slug) : "#"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" className="h-8 px-3 text-[10px]">
                    <Play size={12} /> Watch Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        }

        const item = items[index];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ width: style.width, height: style.height, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ borderRadius: style.radius }}
            className="group relative shrink-0 overflow-hidden"
          >
            <Link href={item.slug ? ROUTES.movie(item.slug) : "#"} aria-label={item.title} className="block h-full w-full">
              <CardMedia item={item} width={style.width} isActive={isActive} />
            </Link>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 bg-linear-to-t from-black via-black/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="line-clamp-1 text-lg font-semibold text-white">{item.title}</p>
              {item.description && (
                <p className="line-clamp-2 text-xs text-white/70">{item.description}</p>
              )}
              {item.slug && (
                <Link href={ROUTES.movie(item.slug)} className="pointer-events-auto w-fit">
                  <Button size="sm" className="h-9 px-4 text-xs">
                    <Play size={14} /> Watch Now
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        );
      })}

      {n > 1 && <ArrowButton direction="right" onClick={() => onGoTo(activeIndex + 1)} />}
    </div>
  );
}
