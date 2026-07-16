import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCatalogPage(page: number, genreSlug?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalogPage(page, genreSlug),
    queryFn: () => movieService.getPage(page, 24, genreSlug),
  });
}
