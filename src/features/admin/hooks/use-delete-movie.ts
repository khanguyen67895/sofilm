"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieAdminService } from "@/services/admin/movie-admin.service";

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => movieAdminService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] });
    },
  });
}
