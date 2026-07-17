"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/common/reveal";
import { MovieCard } from "./movie-card";
import type { MovieRow as MovieRowType } from "@/types/movie";
import { ChevronRight } from "lucide-react";

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
          aria-label="Cuộn tiếp"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-8 top-1/2"
        >
          <Image src="/image/ic_right.png" alt="" width={48} height={48} />
        </motion.button>
      </Reveal>
    </section>
  );
}
