import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/services/movie/movie.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAuthStore } from "@/store/auth.store";

export function useSavedShorts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.savedShorts,
    queryFn: () => movieService.getSavedShorts(),
    enabled: isAuthenticated,
  });
}
