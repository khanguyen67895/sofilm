"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { MovieCard } from "./movie-card";
import type { MovieRow as MovieRowType } from "@/types/movie";

interface MovieRowProps {
  row: MovieRowType;
  viewAllHref?: string;
}

export function MovieRow({ row, viewAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <Reveal className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-white">{row.title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white"
          >
            View All <ChevronRight size={14} />
          </Link>
        )}
      </Reveal>

      <Reveal delay={0.1} className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {row.movies.map((movie) => (
            <div key={movie.id} className="w-32 shrink-0 sm:w-40">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Cuộn tiếp"
          className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white hover:bg-brand sm:flex"
        >
          <ChevronRight size={20} />
        </button>
      </Reveal>
    </section>
  );
}
