"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieAdminService, type MoviePayload } from "@/services/admin/movie-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useUpdateMovie(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<MoviePayload>) =>
      movieAdminService.updateMovie(movieId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMovieDetail(movieId) });
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] });
    },
  });
}
