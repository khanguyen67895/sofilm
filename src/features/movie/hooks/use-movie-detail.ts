import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMovieDetail(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.movieDetail(slug),
    queryFn: () => movieService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
