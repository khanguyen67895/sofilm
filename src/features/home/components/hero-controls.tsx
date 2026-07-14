"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Movie } from "@/types/movie";

interface HeroControlsProps {
  movies: Movie[];
  activeIndex: number;
  onGoTo: (index: number) => void;
}

export function HeroControls({ movies, activeIndex, onGoTo }: HeroControlsProps) {
  return (
    <div className="absolute inset-x-4 bottom-6 flex items-center gap-4 sm:inset-x-8">
      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          onClick={() => onGoTo(activeIndex - 1)}
          aria-label="Phim trước"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronLeft size={16} />
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onGoTo(activeIndex + 1)}
          aria-label="Phim tiếp theo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <div className="scrollbar-none hidden flex-1 gap-2 overflow-x-auto sm:flex">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => onGoTo(index)}
            className={cn(
              "relative h-16 w-12 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-14",
              index !== activeIndex && "opacity-60 hover:opacity-100"
            )}
          >
            <Image src={movie.poster} alt={movie.title} fill sizes="56px" className="object-cover" />
            {index === activeIndex && (
              <motion.div
                layoutId="hero-thumb-ring"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-md border-2 border-brand"
              />
            )}
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
  );
}
