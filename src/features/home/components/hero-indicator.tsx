"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_AUTOPLAY_MS } from "./hero-banner";

/** The thin brand-colored strip pinned to the top of the hero — ported from
 * the reference's `.indicator`. It wipes in from the left over most of the
 * autoplay duration (a visual countdown), then wipes fully out to the right
 * as the cue that a slide change is about to happen. Purely decorative —
 * `HeroBanner`'s own setTimeout is still the source of truth for advancing
 * `activeIndex`; this just restarts in sync with it every time the key
 * (`activeIndex`) changes, same as the countdown bar in HeroControls. */
export function HeroIndicator({ activeIndex, total }: { activeIndex: number; total: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barRef.current || total <= 1) return;
      const fillSeconds = Math.max(HERO_AUTOPLAY_MS / 1000 - 0.8, 0.2);

      gsap.set(barRef.current, { xPercent: -100 });
      const tl = gsap.timeline();
      tl.to(barRef.current, { xPercent: 0, duration: fillSeconds, ease: "sine.inOut" }).to(
        barRef.current,
        { xPercent: 100, duration: 0.8, ease: "sine.inOut" }
      );

      return () => {
        tl.kill();
      };
    },
    { dependencies: [activeIndex, total], scope: barRef }
  );

  if (total <= 1) return null;

  return (
    <div className="absolute inset-x-0 top-0 z-35 h-1 overflow-hidden">
      <div ref={barRef} className="h-full w-full bg-brand" />
    </div>
  );
}
