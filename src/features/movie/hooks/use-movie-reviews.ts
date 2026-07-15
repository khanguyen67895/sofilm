import { useInfiniteQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMovieReviews(movieId: string) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.reviews(movieId),
    queryFn: ({ pageParam }) => reviewService.list(movieId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: Boolean(movieId),
  });
}
