"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Short } from "@/types/shorts";

interface ToggleShortSaveVars {
  shortId: string;
  isSaved: boolean;
}

/** Same optimistic shape as useToggleShortLike, for the save/bookmark flag —
 * also invalidates QUERY_KEYS.savedShorts so the profile's "Video đã lưu"
 * tab reflects the change the next time it's opened. */
export function useToggleShortSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shortId, isSaved }: ToggleShortSaveVars) =>
      isSaved ? movieService.unsaveShort(shortId) : movieService.saveShort(shortId),
    onMutate: async ({ shortId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.shortsFeed });
      const previous = queryClient.getQueryData<Short[]>(QUERY_KEYS.shortsFeed);
      queryClient.setQueryData<Short[]>(QUERY_KEYS.shortsFeed, (old) =>
        old?.map((s) =>
          s.id === shortId
            ? { ...s, isSaved: !isSaved, saves: isSaved ? s.saves - 1 : s.saves + 1 }
            : s
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEYS.shortsFeed, context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedShorts });
    },
  });
}
