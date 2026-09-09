"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Short } from "@/types/shorts";

/** Not a toggle — every completed share bumps the counter, so this just
 * writes the server's returned count back into the shortsFeed cache on
 * success rather than guessing optimistically. */
export function useShareShort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortId: string) => movieService.shareShort(shortId),
    onSuccess: ({ shares }, shortId) => {
      queryClient.setQueryData<Short[]>(QUERY_KEYS.shortsFeed, (old) =>
        old?.map((s) => (s.id === shortId ? { ...s, shares } : s))
      );
    },
  });
}
