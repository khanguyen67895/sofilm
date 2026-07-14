"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";

export function HeroSlide({ movie }: { movie: Movie }) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image src={movie.backdrop} alt={movie.title} fill priority className="object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/20 to-transparent" />

      <motion.div
        key={`${movie.id}-content`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-32 left-4 max-w-xl space-y-4 sm:bottom-28 sm:left-8"
      >
        <h1 className="text-3xl leading-tight font-extrabold text-white uppercase sm:text-5xl">
          {movie.title}
        </h1>
        <p className="line-clamp-3 text-sm text-white/80 sm:text-base">{movie.description}</p>
        <div className="flex gap-3">
          <Link href={ROUTES.watch(movie.slug)}>
            <Button size="lg">
              <Play size={18} /> Watch Now
            </Button>
          </Link>
          <Link href={ROUTES.movie(movie.slug)}>
            <Button variant="secondary" size="lg">
              <Info size={18} /> More Info
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
