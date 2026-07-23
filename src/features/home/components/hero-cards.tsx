"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { gsap } from "@/lib/gsap";
import type { HeroItem } from "@/types/movie";
import { cn } from "@/utils/cn";
import { resolveImageSrc } from "@/utils/image";

const THUMB_WIDTH = 117.984;
const THUMB_HEIGHT = 195.928;
const THUMB_GAP = 12;
const THUMB_RIGHT = 32;
const THUMB_BOTTOM = 108;
/** Only this many thumbnails are ever visible at once — the rest sit parked
 * just off the strip's edge (opacity 0, unclickable) until scrolled into
 * view. Mirrors MovieRow's horizontal-carousel idea, just windowed instead
 * of natively `overflow-x-auto` since these cards also have to escape their
 * slot and grow full-bleed when they become active — a real scroll
 * container would clip that mid-grow. */
const VISIBLE_THUMB_COUNT = 5;
const STRIP_WIDTH = VISIBLE_THUMB_COUNT * (THUMB_WIDTH + THUMB_GAP) - THUMB_GAP;
/** Accumulated wheel-delta px before the window steps by one thumbnail. */
const WHEEL_STEP_PX = 60;

interface HeroCardsProps {
  items: HeroItem[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** `slotIndex` is this item's position among all non-active items in stable
 * array order; `offset` is how far the thumbnail window has been scrolled.
 * Slots outside [0, VISIBLE_THUMB_COUNT) are parked just past whichever
 * edge they'd exit from, hidden, ready to slide in when scrolled back into
 * range. */
function thumbTarget(
  slotIndex: number,
  offset: number,
  containerWidth: number,
  containerHeight: number
) {
  const visibleSlot = slotIndex - offset;
  const clampedSlot = clamp(visibleSlot, -1, VISIBLE_THUMB_COUNT);
  // Mirrored so the window advances toward the left: new thumbnails enter
  // off the strip's right edge and drift left as `offset` grows (i.e. as
  // slides advance forward), instead of entering from the left and drifting
  // right. Only the pixel position flips — `clampedSlot` itself still drives
  // hidden-check/stagger below in its original (unmirrored) sense.
  const mirroredSlot = VISIBLE_THUMB_COUNT - 1 - clampedSlot;
  return {
    geometry: {
      x: containerWidth - THUMB_RIGHT - THUMB_WIDTH - mirroredSlot * (THUMB_WIDTH + THUMB_GAP),
      y: containerHeight - THUMB_BOTTOM - THUMB_HEIGHT,
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      borderRadius: 12,
    },
    hidden: visibleSlot < 0 || visibleSlot >= VISIBLE_THUMB_COUNT,
    // Its *destination* slot, for staggering — using the static array
    // position instead made cards animate out of visual left-to-right order
    // once a slide change could shift the whole window by a slot, not just
    // reposition the one card that just went inactive.
    clampedSlot,
  };
}

/** Desktop-only — mobile uses `HeroMobileOverlay` instead (see HeroBanner).
 * Ported from the "timed cards" reference (gist Ron015/c8723f94ed5e0bbdfc6fb1e8ccc775dc):
 * imperative GSAP tweens on refs instead of Framer's `layout` FLIP diffing.
 * The card that just stopped being active gets the reference's melt-away
 * treatment (scale up + fade while it sits behind the incoming card, then a
 * hard `gsap.set` snap into its new thumbnail slot once the incoming card
 * has finished growing) instead of a plain shrink; the incoming card grows
 * from its thumbnail slot to full-bleed; every other thumbnail just tweens
 * to its new slot position — clamped to a 5-wide window (`VISIBLE_THUMB_COUNT`),
 * scrollable via mouse wheel over the strip. */
export function HeroCards({ items, activeIndex, onGoTo }: HeroCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const prevActiveRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);

  const [thumbScrollOffset, setThumbScrollOffset] = useState(0);
  const maxThumbScrollOffset = Math.max(0, items.length - 1 - VISIBLE_THUMB_COUNT);

  // Every slide change auto-scrolls the window so the item that just
  // stopped being active becomes the frontmost visible thumbnail — mirrors
  // the timed-cards reference, where the whole deck conveyor-belts forward
  // by one slot each step instead of snapping back to the same static-order
  // set. Computed synchronously during render (React's documented "adjust
  // state when a prop changes" pattern — a ref can't be read during
  // render), so it never flashes the stale window for a frame.
  const [prevActiveForReset, setPrevActiveForReset] = useState(activeIndex);
  if (prevActiveForReset !== activeIndex) {
    const priorActiveIndex = prevActiveForReset;
    setPrevActiveForReset(activeIndex);
    const nextRestOrder = items.map((_, i) => i).filter((i) => i !== activeIndex);
    const priorActiveNewSlot = nextRestOrder.indexOf(priorActiveIndex);
    const nextOffset = clamp(Math.max(priorActiveNewSlot, 0), 0, maxThumbScrollOffset);
    if (thumbScrollOffset !== nextOffset) setThumbScrollOffset(nextOffset);
  }

  // Native wheel listener, not React's `onWheel` — React attaches wheel as a
  // passive listener by default, so `preventDefault()` inside the JSX prop
  // is silently ignored (and warns). Scoped to the strip's own screen-space
  // rect so wheeling elsewhere over the hero still scrolls the page.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleWheel(e: WheelEvent) {
      const rect = container!.getBoundingClientRect();
      const stripRight = rect.right - THUMB_RIGHT;
      const stripLeft = stripRight - STRIP_WIDTH;
      const stripBottom = rect.bottom - THUMB_BOTTOM;
      const stripTop = stripBottom - THUMB_HEIGHT;
      const withinStrip =
        e.clientX >= stripLeft &&
        e.clientX <= stripRight &&
        e.clientY >= stripTop &&
        e.clientY <= stripBottom;
      if (!withinStrip) return;

      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccumRef.current += delta;
      if (Math.abs(wheelAccumRef.current) < WHEEL_STEP_PX) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      setThumbScrollOffset((prev) => clamp(prev + direction, 0, maxThumbScrollOffset));
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [maxThumbScrollOffset]);

  // A plain layout effect, not `useGSAP` — `useGSAP`'s context reverts every
  // inline style it set on the *previous* run before re-running the
  // callback whenever a dependency changes, which fights this component's
  // design: each transition's `.to()` starts from wherever the *last* run
  // left the element (a persistent, incremental position), not from a
  // freshly-declared state. Under `useGSAP` that revert stripped a card's
  // in-flight position/opacity the instant a later card's turn came up in
  // the `delay:` stagger, which is why cards further down the queue (5th+)
  // looked like they weren't animating at all.
  useLayoutEffect(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const prevIndex = prevActiveRef.current;
      const isFirstRun = prevIndex === null;
      const restOrder = items.map((_, i) => i).filter((i) => i !== activeIndex);

      items.forEach((item, index) => {
        const el = cardRefs.current.get(item.id);
        if (!el) return;

        const isActive = index === activeIndex;
        const { geometry, hidden, clampedSlot } = isActive
          ? { geometry: { x: 0, y: 0, width, height, borderRadius: 0 }, hidden: false, clampedSlot: 0 }
          : thumbTarget(restOrder.indexOf(index), thumbScrollOffset, width, height);

        if (isFirstRun) {
          gsap.set(el, {
            ...geometry,
            zIndex: isActive ? 2 : 30,
            opacity: hidden ? 0 : 1,
            pointerEvents: hidden ? "none" : "auto",
          });
          return;
        }

        if (isActive) {
          gsap.set(el, { zIndex: 2 });
          gsap.to(el, { ...geometry, duration: 0.7, ease: "sine.inOut" });
        } else if (index === prevIndex) {
          gsap.set(el, { zIndex: 1 });
          gsap
            .timeline()
            .to(el, { scale: 1.15, opacity: 0, duration: 0.6, ease: "sine.inOut" })
            .set(el, {
              ...geometry,
              scale: 1,
              opacity: hidden ? 0 : 1,
              zIndex: 30,
              pointerEvents: hidden ? "none" : "auto",
            })
            .call(() => {
              if (!hidden) gsap.set(el, { clearProps: "opacity" });
            });
        } else {
          gsap.set(el, { pointerEvents: hidden ? "none" : "auto" });
          gsap.to(el, {
            ...geometry,
            opacity: hidden ? 0 : 1,
            duration: 0.6,
            ease: "sine.inOut",
            delay: 0.05 * Math.max(clampedSlot, 0),
            onComplete: () => {
              if (!hidden) gsap.set(el, { clearProps: "opacity" });
            },
          });
        }
      });

      prevActiveRef.current = activeIndex;
    },
    [activeIndex, items, thumbScrollOffset]
  );

  return (
    <div ref={containerRef} className="absolute inset-0">
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={item.id}
            ref={(el) => {
              if (el) cardRefs.current.set(item.id, el);
              else cardRefs.current.delete(item.id);
            }}
            onClick={() => !isActive && onGoTo(index)}
            className={cn(
              "absolute top-0 left-0 overflow-hidden",
              isActive ? "z-2" : "z-30 cursor-pointer opacity-70 hover:opacity-100"
            )}
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
          </div>
        );
      })}
    </div>
  );
}
