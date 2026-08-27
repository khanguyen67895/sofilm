"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/common/reveal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MovieCard } from "./movie-card";
import type { MovieRow as MovieRowType } from "@/types/movie";
import { ChevronRight } from "lucide-react";

interface MovieRowProps {
  row: MovieRowType;
  viewAllHref?: string;
}

export function MovieRow({ row, viewAllHref }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <Reveal className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-white">{row.title}</h2>
        {/* Desktop: navigates to the full catalog. Mobile: there's no
         * separate floating scroll button there (removed below), so this
         * same circle just scrolls the row instead. */}
        {viewAllHref && (isDesktop ? (
          <Link
            href={viewAllHref}
            aria-label="View all"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Scroll next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 pt-6 pb-4 sm:px-8 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {row.movies.map((movie) => (
            <div key={movie.id} className="w-40 shrink-0 sm:w-55">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll next"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-8 top-1/2 hidden sm:block"
        >
          <Image src="/image/ic_right.png" alt="" width={48} height={48} />
        </motion.button>
      </Reveal>
    </section>
  );
}
