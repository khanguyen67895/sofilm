import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useTrending() {
  return useQuery({
    queryKey: QUERY_KEYS.trending,
    queryFn: () => movieService.getTrending(),
  });
}
