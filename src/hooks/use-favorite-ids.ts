"use client";

import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAuthStore } from "@/store/auth.store";

/** The single source of truth for "did I favorite this movie" — every
 * MovieCard/LikeShareBar reads from this shared cache instead of trusting a
 * per-movie `isFavorite` flag from the API (movie-service can't compute that
 * itself: favorites are owned by user-service, a separate database, per the
 * no-shared-DB-access rule — so movie responses never actually set it, which
 * is why a per-card local `useState` seeded from it went stale on reload).
 * Shares its cache with useFavorites() (same query key) so a card grid and
 * the profile favorites list never double-fetch. */
export function useFavoriteIds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.favorites,
    queryFn: () => movieService.getFavorites(),
    enabled: isAuthenticated,
    select: (movies) => new Set(movies.map((m) => m.id)),
  });
}
