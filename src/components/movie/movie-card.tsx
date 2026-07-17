"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FavoriteIcon, UnfavoriteIcon } from "@/components/common/favorite-icons";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

export function MovieCard({ movie }: { movie: Movie }) {
  const isFavorite = Boolean(useFavoriteIds().data?.has(movie.id));
  const toggleFavorite = useToggleFavorite();

  function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate({ movie, isFavorite });
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="group relative w-full shrink-0"
    >
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
          {movie.isPremium && <Badge className="absolute top-2 left-2 z-20">Premium</Badge>}
          <motion.button
            type="button"
            onClick={handleToggleFavorite}
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
          {movie.reviewsCount > 0 && (
            <span className="text-white/50">({movie.reviewsCount})</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
