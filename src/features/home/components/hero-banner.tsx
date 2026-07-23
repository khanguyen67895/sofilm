"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { HeroItem } from "@/types/movie";
import { HeroCards } from "./hero-cards";
import { HeroIndicator } from "./hero-indicator";
import { HeroMobileOverlay } from "./hero-mobile-overlay";
import { HeroSlide } from "./hero-slide";
import { HeroControls } from "./hero-controls";

/** How long each slide stays up before auto-advancing — also drives the
 * countdown progress bar in HeroControls (same duration, kept in sync). */
export const HERO_AUTOPLAY_MS = 7000;

export function HeroBanner({ items }: { items: HeroItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function goTo(index: number) {
    setActiveIndex((index + items.length) % items.length);
  }

  // Re-armed on every slide change, whether triggered by this timer or a
  // manual click — the countdown always restarts from a fresh full duration.
  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setTimeout(() => goTo(activeIndex + 1), HERO_AUTOPLAY_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length]);

  if (!active) return null;

  return (
    <div className="relative -mt-20 h-215 w-full overflow-hidden">
      <HeroIndicator activeIndex={activeIndex} total={items.length} />
      {isDesktop ? (
        <>
          <HeroCards items={items} activeIndex={activeIndex} onGoTo={goTo} />
          <HeroSlide item={active} />
          <HeroControls activeIndex={activeIndex} total={items.length} onGoTo={goTo} />
        </>
      ) : (
        <HeroMobileOverlay items={items} activeIndex={activeIndex} onGoTo={goTo} />
      )}
    </div>
  );
}
