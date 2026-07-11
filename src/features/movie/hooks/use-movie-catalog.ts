import { useInfiniteQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMovieCatalog() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.moviePage,
    queryFn: ({ pageParam }) => movieService.getPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
