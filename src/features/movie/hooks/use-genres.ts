import { useQuery } from "@tanstack/react-query";
import { genreService } from "@/services/genre/genre.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useGenres() {
  return useQuery({
    queryKey: QUERY_KEYS.genres,
    queryFn: () => genreService.getAll(),
  });
}
