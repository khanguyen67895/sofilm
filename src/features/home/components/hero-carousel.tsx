"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
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
  "-2": { width: 220, height: 459, radius: 12 },
  "-1": { width: 260, height: 484, radius: 12 },
  "0": { width: 370, height: 600, radius: 20 },
  "1": { width: 260, height: 484, radius: 12 },
  "2": { width: 220, height: 459, radius: 12 },
};

/** Side cards angle away from the active poster in 3D (rotateY) so the row
 * reads as a shallow arc/coverflow instead of flat rectangles side by side —
 * the near edge (toward the center card) tilts forward, the far edge recedes. */
const ROTATE_STYLE: Record<number, number> = {
  "-2": 60,
  "-1": 40,
  "0": 0,
  "1": -40,
  "2": -60,
};

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

const GAP_PX = 24; // matches `gap-6` on the card row

/** Tracks an element's own layout width (unaffected by any `transform` on
 * it) so the card row's natural, un-scaled width can be compared against the
 * space actually available and shrunk to fit — instead of the previous
 * fixed-pixel SLOT_STYLE sizes, which broke (arrows/cards overflowing,
 * overlapping) on any viewport narrower than the Figma reference frame. */
function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
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
        // Same poster frame the still-image branch below would show — without
        // it the browser paints a blank/black frame the instant this card
        // becomes active, until the video has enough data to decode its
        // first frame, which reads as the whole carousel "jumping" every
        // time the active slide has a video.
        poster={resolveImageSrc(item.poster || item.backdrop, PLACEHOLDER_IMAGE)}
        muted
        loop
        playsInline
        preload="auto"
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

  // Once maxOffset picks how many cards show, this shrinks THOSE cards
  // uniformly to whatever width is actually available — instead of the old
  // fixed SLOT_STYLE pixels overflowing (and the arrow buttons overlapping
  // the outer cards) on any viewport narrower than the Figma reference frame.
  // Measured on the padding-free row below (not the outer padded/clipped
  // div) so its width IS the space the arc actually centers within — same
  // number the arc's own centering math uses, no need to separately know
  // the outer div's responsive padding.
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);
  const naturalWidth =
    visible.reduce((sum, { offset }) => sum + SLOT_STYLE[offset].width, 0) +
    GAP_PX * (visible.length - 1);
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / naturalWidth) : 1;
  // Empty space on each side once the arc is centered: 0 while the arc is
  // shrunk to exactly fill the row (scale < 1), growing on screens wider
  // than the arc's natural size (scale === 1) — this is what makes the
  // static `left-14`-style offset drift away from the card on a "full
  // screen" viewport instead of tracking it.
  const arcMargin = Math.max(0, (containerWidth - naturalWidth * scale) / 2);

  return (
    <div className="relative w-full overflow-hidden px-6 sm:px-8 lg:px-20">
      <div ref={containerRef} className="relative">
        {n > 1 && (
          <motion.button
            type="button"
            onClick={() => onGoTo(activeIndex - 1)}
            aria-label="Previous"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ left: arcMargin }}
            className="absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
          >
            <Image src="/image/ic_left.png" alt="" width={48} height={48} />
          </motion.button>
        )}

        <div
          className="flex items-center justify-center gap-6"
          style={{ perspective: 1400, transform: `scale(${scale})` }}
        >
          {visible.map(({ offset, index }) => {
            const style = SLOT_STYLE[offset];
            const rotateY = ROTATE_STYLE[offset];
            const isActive = offset === 0;

            // Combined with the parent's 3D `perspective`, a large rotateY on
            // an overflow-hidden/rounded box can make some browsers paint a
            // mirrored "backface" ghost of the image — hiding the backface
            // explicitly stops that.
            const cardStyle = {
              width: style.width,
              height: style.height,
              borderRadius: style.radius,
              willChange: "transform",
              backfaceVisibility: "hidden" as const,
            };

            if (!isActive) {
              const item = items[index];
              return (
                <motion.div
                  key={item.id}
                  layout
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotateY }}
                  transition={{ duration: 0.5, ease: "easeInOut", layout: { duration: 0.5, ease: "easeInOut" } }}
                  style={cardStyle}
                  onClick={() => onGoTo(index)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onGoTo(index)}
                  aria-label={item.title}
                  className="group relative shrink-0 cursor-pointer overflow-hidden bg-[#D9D9D9] outline-none"
                >
                  <CardMedia item={item} width={style.width} isActive={false} />

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
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", layout: { duration: 0.5, ease: "easeInOut" } }}
                style={cardStyle}
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
        </div>

        {n > 1 && (
          <motion.button
            type="button"
            onClick={() => onGoTo(activeIndex + 1)}
            aria-label="Next"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ right: arcMargin }}
            className="absolute top-1/2 z-30 translate-x-1/2 -translate-y-1/2"
          >
            <Image src="/image/ic_right.png" alt="" width={48} height={48} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
