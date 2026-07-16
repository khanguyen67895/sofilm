"use client";

import { useState } from "react";
import type { HeroItem } from "@/types/movie";
import { HeroSlide } from "./hero-slide";
import { HeroControls } from "./hero-controls";

export function HeroBanner({ items }: { items: HeroItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  function goTo(index: number) {
    setActiveIndex((index + items.length) % items.length);
  }

  if (!active) return null;

  return (
    <div className="relative -mt-20 h-[calc(62vh+5rem)] min-h-115 w-full overflow-hidden">
      <HeroSlide item={active} />
      <HeroControls items={items} activeIndex={activeIndex} onGoTo={goTo} />
    </div>
  );
}
