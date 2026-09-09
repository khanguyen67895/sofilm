"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Short } from "@/types/shorts";

interface ToggleShortLikeVars {
  shortId: string;
  isLiked: boolean;
}

/** Optimistically flips isLiked/likes for one item in the shared shortsFeed
 * cache (QUERY_KEYS.shortsFeed) — mirrors useToggleFavorite's pattern, but
 * against a flat array of per-item flags instead of a favorited-ids list,
 * since every Short already carries its own isLiked/likes. Replaces the old
 * per-ShortItem local useState so every mounted item and a feed refetch stay
 * in sync. */
export function useToggleShortLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shortId, isLiked }: ToggleShortLikeVars) =>
      isLiked ? movieService.unlikeShort(shortId) : movieService.likeShort(shortId),
    onMutate: async ({ shortId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.shortsFeed });
      const previous = queryClient.getQueryData<Short[]>(QUERY_KEYS.shortsFeed);
      queryClient.setQueryData<Short[]>(QUERY_KEYS.shortsFeed, (old) =>
        old?.map((s) =>
          s.id === shortId
            ? { ...s, isLiked: !isLiked, likes: isLiked ? s.likes - 1 : s.likes + 1 }
            : s
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.shortsFeed, context.previous);
    },
  });
}
