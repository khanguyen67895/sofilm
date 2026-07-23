"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

/** Ported from the reference's `.slide-numbers` — an odometer-style counter:
 * every index is pre-rendered in a column, clipped by an overflow-hidden
 * frame, and the whole track slides so the active number lands in view.
 * The reference slides horizontally (its numbers sit in a row); a vertical
 * roll reads better once this is inline in a flex row of its own. */
export function HeroSlideNumber({
  activeIndex,
  total,
  className,
  itemClassName,
}: {
  activeIndex: number;
  total: number;
  className?: string;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemHeight = useRef(0);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const first = track.firstElementChild as HTMLElement | null;
      if (first) itemHeight.current = first.offsetHeight;

      gsap.to(track, {
        y: -activeIndex * itemHeight.current,
        duration: 0.6,
        ease: "sine.inOut",
      });
    },
    { dependencies: [activeIndex, total], scope: trackRef }
  );

  return (
    <div className={cn("h-10 w-20 shrink-0 overflow-hidden", className)}>
      <div ref={trackRef}>
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex h-10 items-center text-[40px] font-bold text-white/70",
              itemClassName
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
}
