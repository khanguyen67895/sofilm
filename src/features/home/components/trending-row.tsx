"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/common/reveal";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useGridCardWidth } from "@/hooks/use-grid-card-width";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";
import { ChevronRight } from "lucide-react";

export function TrendingRow({ movies }: { movies: Movie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  // Matches AllMoviesSection's fluid grid card width exactly (same min +
  // gap + container padding), so this scroll row's fixed-width cards line
  // up with it pixel-for-pixel instead of an eyeballed static width.
  const cardWidth = useGridCardWidth(scrollRef, isDesktop ? 176 : 128);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 480, behavior: "smooth" });
  }

  function scrollPrev() {
    scrollRef.current?.scrollBy({ left: -480, behavior: "smooth" });
  }

  return (
    <section className="space-y-3">
      <Reveal className="flex items-center justify-between px-6 sm:px-24 lg:px-40">
        <h2 className="text-lg font-semibold text-white">Top Trending Movies</h2>
        {/* Desktop: navigates to the full catalog. Mobile: there's no
         * separate floating scroll button there (removed below), so this
         * same circle just scrolls the row instead. */}
        {isDesktop ? (
        <Link
          href={ROUTES.category}
          aria-label="View all"
          className="flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          View all
          <ChevronRight size={16} />
        </Link>
        ) : (
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Scroll next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <Image src="/image/ic_right.png" alt="" width={32} height={32} />
          </button>
        )}
      </Reveal>

      <Reveal delay={0.1} className="relative">
        {/* The padding lives on this outer, non-scrolling box and clips
         * (`overflow-x-clip`) anything the inner row scrolls past it — so the
         * gutter is a real boundary the cards never cross, at rest or mid-scroll,
         * instead of only showing up at the very start/end of the scroll range. */}
        <div className="overflow-x-clip px-6 sm:px-24 lg:px-40">
          <div
            ref={scrollRef}
            className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {movies.map((movie, index) => (
              <Link
                key={movie.id}
                href={ROUTES.movie(movie.slug)}
                style={{ width: cardWidth }}
                className="group relative shrink-0"
              >
                <div className="relative aspect-3/5 overflow-hidden rounded-2xl bg-white/5">
                  <Image
                    src={resolveImageSrc(movie.poster, PLACEHOLDER_IMAGE)}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 160px, 208px"
                    quality={90}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                    <Image
                      src="/image/ic_play.png"
                      alt=""
                      width={80}
                      height={80}
                      className="scale-90 transition-transform duration-200 group-hover:scale-100"
                    />
                  </div>
                  <span
                    className="font-rank absolute -bottom-1 left-1.5 text-[56px] leading-normal font-normal text-white"
                    style={{ textShadow: "0 1px 20px #FFF" }}
                  >
                    {index + 1}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-xs font-medium text-white/90">
                  {movie.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <motion.button
          type="button"
          onClick={scrollPrev}
          aria-label="Scroll previous"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 left-34 z-20 hidden sm:block"
        >
          <Image src="/image/ic_left.png" alt="" width={48} height={48} />
        </motion.button>

        <motion.button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll next"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1/2 right-34 z-20 hidden sm:block"
        >
          <Image src="/image/ic_right.png" alt="" width={48} height={48} />
        </motion.button>
      </Reveal>
    </section>
  );
}
