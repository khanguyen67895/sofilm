"use client";

import { useMutation } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";

export function useToggleReviewLike(movieId: string) {
  return useMutation({
    mutationFn: (reviewId: string) => reviewService.toggleLike(movieId, reviewId),
  });
}
