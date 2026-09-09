"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useShortComments(shortId: string) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.shortComments(shortId),
    queryFn: ({ pageParam }) => movieService.getShortComments(shortId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(shortId),
  });
}
