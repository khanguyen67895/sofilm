"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieAdminService, type EpisodePayload } from "@/services/admin/movie-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCreateEpisode(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EpisodePayload) => movieAdminService.createEpisode(movieId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMovieDetail(movieId) });
    },
  });
}

export function useUpdateEpisode(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      episodeId,
      payload,
    }: {
      episodeId: string;
      payload: Partial<EpisodePayload>;
    }) => movieAdminService.updateEpisode(movieId, episodeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMovieDetail(movieId) });
    },
  });
}

export function useDeleteEpisode(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (episodeId: string) => movieAdminService.deleteEpisode(movieId, episodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminMovieDetail(movieId) });
    },
  });
}
