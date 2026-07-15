"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import type { CreateReviewPayload } from "@/types/review";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useSubmitReview(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.submit(movieId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviewSummary(movieId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(movieId) });
    },
  });
}
