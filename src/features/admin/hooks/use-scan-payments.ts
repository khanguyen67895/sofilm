"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentAdminService } from "@/services/admin/payment-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useScanPayments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => paymentAdminService.scan(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUnmatchedPayments });
    },
  });
}
