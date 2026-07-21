import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

/** The homepage's "All Movies" preview — capped at the 10 newest titles;
 * "View All" (AllMoviesSection) links to /category for the full catalog. */
export function useMoviesPreview() {
  return useQuery({
    queryKey: QUERY_KEYS.moviesPreview,
    queryFn: () => movieService.getPage(1, 10),
    select: (data) => data.items,
  });
}
