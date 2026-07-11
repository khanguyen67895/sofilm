import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useDebounce } from "@/hooks/use-debounce";

export function useSearchMovies(query: string) {
  const debouncedQuery = useDebounce(query, 350);

  return useQuery({
    queryKey: QUERY_KEYS.movieSearch(debouncedQuery),
    queryFn: () => movieService.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });
}
