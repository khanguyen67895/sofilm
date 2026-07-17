import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

/** Alphabetical, not newest-first — so this preview doesn't just repeat the
 * homepage's own New Releases row above it. */
export function useMoviesPreview() {
  return useQuery({
    queryKey: QUERY_KEYS.moviesPreview,
    queryFn: () => movieService.getPage(1, 18, undefined, "title"),
    select: (data) => data.items,
  });
}
