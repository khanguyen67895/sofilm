"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FavoriteIcon, UnfavoriteIcon } from "@/components/common/favorite-icons";
import { RatingStarIcon } from "@/components/common/rating-star-icon";
import { PLACEHOLDER_IMAGE } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useFavoriteIds } from "@/hooks/use-favorite-ids";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import type { Movie } from "@/types/movie";
import { resolveImageSrc } from "@/utils/image";

export function MovieCard({ movie }: { movie: Movie }) {
  const isFavorite = Boolean(useFavoriteIds().data?.has(movie.id));
  const toggleFavorite = useToggleFavorite();
  const requireAuth = useRequireAuth();

  function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(
      () => toggleFavorite.mutate({ movie, isFavorite }),
      "Log in to save movies to your favorites."
    );
  }

  return (
    <div className="group relative pt-2 w-full shrink-0">
      {movie.isPremium && (
        <Image
          src="/image/ic_premium.png"
          alt="Premium"
          width={141}
          height={36}
          className="absolute top-0 left-1/2 z-20 h-auto w-[60%] max-w-28 -translate-x-1/2"
        />
      )}
      <Link href={ROUTES.movie(movie.slug)} className="block">
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
          <motion.button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            whileTap={{ scale: 0.8 }}
            className="absolute top-1.5 right-1.5 z-10"
          >
            {isFavorite ? (
              <UnfavoriteIcon width={22} height={22} />
            ) : (
              <FavoriteIcon width={22} height={22} />
            )}
          </motion.button>
        </div>
        <p className="mt-1.5 truncate text-sm font-medium text-[#F2F2F2]">{movie.title}</p>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-[#F2F2F2]">
          <RatingStarIcon width={11} height={10} />
          {movie.rating}
          {movie.reviewsCount > 0 && (
            <span className="text-white/50">({movie.reviewsCount})</span>
          )}
        </div>
      </Link>
    </div>
  );
}
