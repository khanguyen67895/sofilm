"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/common/reveal";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";
import { ChevronRight } from "lucide-react";

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
          className="absolute top-1/2 right-8"
        >
          <Image src="/image/ic_right.png" alt="" width={48} height={48} />
        </motion.button>
      </Reveal>
    </section>
  );
}
