"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieAdminService, type MoviePayload } from "@/services/admin/movie-admin.service";

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MoviePayload) => movieAdminService.createMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] });
    },
  });
}
