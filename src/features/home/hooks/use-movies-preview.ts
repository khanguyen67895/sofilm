import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMoviesPreview() {
  return useQuery({
    queryKey: QUERY_KEYS.moviesPreview,
    queryFn: () => movieService.getPage(1, 18),
    select: (data) => data.items,
  });
}
