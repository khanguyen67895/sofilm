"use client";

import { useQuery } from "@tanstack/react-query";
import { movieAdminService } from "@/services/admin/movie-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminMovieDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adminMovieDetail(id),
    queryFn: () => movieAdminService.getMovieById(id),
    enabled: Boolean(id),
  });
}
