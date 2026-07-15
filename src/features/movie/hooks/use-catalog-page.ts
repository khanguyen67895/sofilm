import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";

interface GenreBucket {
  slug: string;
  index: number;
  count: number;
}

export function useCatalogPage(page: number, genre?: GenreBucket) {
  return useQuery({
    queryKey: QUERY_KEYS.catalogPage(page, genre?.slug),
    queryFn: () =>
      movieService.getPage(
        page,
        24,
        genre ? { index: genre.index, count: genre.count } : undefined
      ),
  });
}
