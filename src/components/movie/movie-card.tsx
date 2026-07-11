"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="group relative w-full shrink-0"
    >
      <Link href={ROUTES.movie(movie.slug)} className="block">
        <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-white/5">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 40vw, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {movie.isPremium && (
            <Badge className="absolute left-0 top-2">Premium</Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-linear-to-t from-black/90 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {movie.rating}
          </div>
        </div>
        <p className="mt-2 truncate text-sm font-medium text-white/90">
          {movie.title}
        </p>
      </Link>
    </motion.div>
  );
}
