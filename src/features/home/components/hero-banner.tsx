"use client";

import { useState } from "react";
import type { Movie } from "@/types/movie";
import { HeroSlide } from "./hero-slide";
import { HeroControls } from "./hero-controls";

export function HeroBanner({ movies }: { movies: Movie[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = movies[activeIndex];

  function goTo(index: number) {
    setActiveIndex((index + movies.length) % movies.length);
  }

  if (!active) return null;

  return (
    <div className="relative -mt-20 h-[calc(62vh+5rem)] min-h-115 w-full overflow-hidden">
      <HeroSlide movie={active} />
      <HeroControls movies={movies} activeIndex={activeIndex} onGoTo={goTo} />
    </div>
  );
}
