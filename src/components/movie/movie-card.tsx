"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FavoriteIcon, UnfavoriteIcon } from "@/components/common/favorite-icons";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { movieService } from "@/services/movie/movie.service";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

export function MovieCard({ movie }: { movie: Movie }) {
  const [isFavorite, setIsFavorite] = useState(Boolean(movie.isFavorite));

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite);

    const request = wasFavorite
      ? movieService.removeFavorite(movie.id)
      : movieService.addFavorite(movie.id);

    request.catch(() => setIsFavorite(wasFavorite));
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="group relative pt-2 w-full shrink-0"
    >
      {movie.isPremium && (
        <Image
          src="/image/ic_premium.png"
          alt="Premium"
          width={141}
          height={36}
          className="absolute top-0 left-1/2 z-20 h-auto w-[70%] max-w-35 -translate-x-1/2"
        />
      )}
      <Link href={ROUTES.movie(movie.slug)} className="block">
        <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-white/5">
          <Image
            src={resolveImageSrc(movie.poster, PLACEHOLDER_IMAGE)}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 160px, 220px"
            quality={90}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <motion.button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            whileTap={{ scale: 0.8 }}
            className="absolute top-2 right-2"
          >
            {isFavorite ? (
              <UnfavoriteIcon width={28} height={28} />
            ) : (
              <FavoriteIcon width={28} height={28} />
            )}
          </motion.button>
        </div>
        <p className="mt-2 truncate text-base font-medium text-[#F2F2F2]">{movie.title}</p>
        <div className="mt-1 flex items-center gap-1 text-sm text-[#F2F2F2]">
          <RatingStarIcon width={13} height={12} />
          {movie.rating}
        </div>
      </Link>
    </motion.div>
  );
}
