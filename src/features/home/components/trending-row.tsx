"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";

export function TrendingRow({ movies }: { movies: Movie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <Reveal className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-white">Top Trending Movies</h2>
        <Link
          href={ROUTES.category}
          className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white"
        >
          View All <ChevronRight size={14} />
        </Link>
      </Reveal>

      <Reveal delay={0.1} className="relative">
        <div
          ref={scrollRef}
          className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-8"
        >
          {movies.map((movie, index) => (
            <Link
              key={movie.id}
              href={ROUTES.movie(movie.slug)}
              className="group relative w-32 shrink-0 sm:w-40"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 40vw, 200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span
                  className="absolute -bottom-2 -left-1 text-6xl font-black text-white/90 sm:text-7xl"
                  style={{ WebkitTextStroke: "2px black" }}
                >
                  {index + 1}
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-medium text-white/90">
                {movie.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Cuộn tiếp"
          className="absolute top-1/2 right-2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white hover:bg-brand sm:flex"
        >
          <ChevronRight size={20} />
        </button>
      </Reveal>
    </section>
  );
}
