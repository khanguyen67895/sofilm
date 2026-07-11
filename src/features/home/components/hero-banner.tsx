"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";

export function HeroBanner({ movies }: { movies: Movie[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = movies[activeIndex];

  function goTo(index: number) {
    setActiveIndex((index + movies.length) % movies.length);
  }

  if (!active) return null;

  return (
    <div className="relative h-[62vh] min-h-95 w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image
            src={active.backdrop}
            alt={active.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/20 to-transparent" />

      <motion.div
        key={`${active.id}-content`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-32 left-4 max-w-xl space-y-4 sm:bottom-28 sm:left-8"
      >
        <h1 className="text-3xl leading-tight font-extrabold text-white uppercase sm:text-5xl">
          {active.title}
        </h1>
        <p className="line-clamp-3 text-sm text-white/80 sm:text-base">
          {active.description}
        </p>
        <div className="flex gap-3">
          <Link href={ROUTES.watch(active.slug)}>
            <Button size="lg">
              <Play size={18} /> Watch Now
            </Button>
          </Link>
          <Link href={ROUTES.movie(active.slug)}>
            <Button variant="secondary" size="lg">
              <Info size={18} /> More Info
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="absolute inset-x-4 bottom-6 flex items-center gap-4 sm:inset-x-8">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Phim trước"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Phim tiếp theo"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="scrollbar-none hidden flex-1 gap-2 overflow-x-auto sm:flex">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative h-16 w-12 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:h-20 sm:w-14",
                index === activeIndex
                  ? "border-brand"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / movies.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-white/70">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
