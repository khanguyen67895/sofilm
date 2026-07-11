import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useHomeRows() {
  return useQuery({
    queryKey: QUERY_KEYS.homeRows,
    queryFn: () => movieService.getHomeRows(),
  });
}
