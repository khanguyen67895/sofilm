import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useLatestMovies(limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.latestMovies,
    queryFn: () => movieService.getLatest(limit),
  });
}
