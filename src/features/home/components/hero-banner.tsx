"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { HeroItem } from "@/types/movie";
import { HeroCarousel } from "./hero-carousel";
import { HeroIndicator } from "./hero-indicator";
import { HeroMobileOverlay } from "./hero-mobile-overlay";

/** How long each slide stays up before auto-advancing — also drives the
 * countdown progress bar on mobile (same duration, kept in sync). */
export const HERO_AUTOPLAY_MS = 7000;

/** The hero only ever shows a handful of featured picks — cap the pool at 5
 * regardless of how many banners the backend/mock sends, so the carousel
 * (desktop arc + mobile thumbnail strip) stays readable and just auto-cycles
 * through those 5 instead of growing unbounded. */
const MAX_HERO_ITEMS = 5;

export function HeroBanner({ items: allItems }: { items: HeroItem[] }) {
  const items = allItems.slice(0, MAX_HERO_ITEMS);
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

  if (!isDesktop) {
    return (
      <div className="relative -mt-20 h-215 w-full overflow-hidden">
        <HeroIndicator activeIndex={activeIndex} total={items.length} />
        <HeroMobileOverlay items={items} activeIndex={activeIndex} onGoTo={goTo} />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-background py-16">
      <Image
        src="/image/ic_background_hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_65%]"
      />
      {/* Fades the background image into the page's own background color at
       * the top/bottom edges so the hero blends into the header above and
       * the row sections below instead of hard-cutting into them. */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      <HeroCarousel items={items} activeIndex={activeIndex} onGoTo={goTo} />
    </div>
  );
}
