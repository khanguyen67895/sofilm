"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Movie } from "@/types/movie";

interface ToggleFavoriteVars {
  movie: Movie;
  isFavorite: boolean;
}

/** Optimistically adds/removes `movie` from the shared favorites cache
 * (QUERY_KEYS.favorites, same one useFavoriteIds/useFavorites read) so every
 * card showing it and the profile favorites list update in lockstep, then
 * rolls back if the request fails. */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movie, isFavorite }: ToggleFavoriteVars) =>
      isFavorite ? movieService.removeFavorite(movie.id) : movieService.addFavorite(movie.id),
    onMutate: async ({ movie, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.favorites });
      const previous = queryClient.getQueryData<Movie[]>(QUERY_KEYS.favorites) ?? [];
      const next = isFavorite
        ? previous.filter((m) => m.id !== movie.id)
        : [...previous, movie];
      queryClient.setQueryData(QUERY_KEYS.favorites, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context) queryClient.setQueryData(QUERY_KEYS.favorites, context.previous);
    },
  });
}
