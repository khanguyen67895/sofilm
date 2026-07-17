"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/common/reveal";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";
import { ChevronRight } from "lucide-react";

export function TrendingRow({ movies }: { movies: Movie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <Reveal className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-white">Top Trending Movies</h2>
        {/* Desktop: navigates to the full catalog. Mobile: there's no
         * separate floating scroll button there (removed below), so this
         * same circle just scrolls the row instead. */}
        {isDesktop ? (
          <Link
            href={ROUTES.category}
            aria-label="Xem tất cả"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Cuộn tiếp"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        )}
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
              className="group relative w-40 shrink-0 sm:w-55"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={resolveImageSrc(movie.poster, PLACEHOLDER_IMAGE)}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 160px, 220px"
                  quality={90}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span
                  className="font-rank absolute -bottom-2 left-2 text-[70px] leading-normal font-normal text-white"
                  style={{ textShadow: "0 1px 20px #FFF" }}
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

        <motion.button
          type="button"
          onClick={scrollNext}
          aria-label="Cuộn tiếp"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 right-8 hidden sm:block"
        >
          <Image src="/image/ic_right.png" alt="" width={48} height={48} />
        </motion.button>
      </Reveal>
    </section>
  );
}
