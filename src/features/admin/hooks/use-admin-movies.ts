"use client";

import { useQuery } from "@tanstack/react-query";
import { movieAdminService } from "@/services/admin/movie-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminMovies(page: number) {
  return useQuery({
    queryKey: QUERY_KEYS.adminMovies(page),
    queryFn: () => movieAdminService.listMovies(page),
  });
}
