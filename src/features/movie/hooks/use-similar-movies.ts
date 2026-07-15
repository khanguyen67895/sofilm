import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useSimilarMovies(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.similarMovies(slug),
    queryFn: () => movieService.getSimilar(slug),
    enabled: Boolean(slug),
  });
}
