import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useReviewSummary(movieId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.reviewSummary(movieId),
    queryFn: () => reviewService.getSummary(movieId),
    enabled: Boolean(movieId),
  });
}
