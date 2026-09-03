"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useSubmitReply(movieId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      reviewService.submitReply(movieId, commentId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(movieId) });
    },
  });
}
