"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Short } from "@/types/shorts";

export function useSubmitShortComment(shortId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => movieService.postShortComment(shortId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shortComments(shortId) });
      queryClient.setQueryData<Short[]>(QUERY_KEYS.shortsFeed, (old) =>
        old?.map((s) => (s.id === shortId ? { ...s, comments: s.comments + 1 } : s))
      );
    },
  });
}
