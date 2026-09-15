"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentAdminService } from "@/services/admin/payment-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useApprovePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (refCode: string) => paymentAdminService.approve(refCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUnmatchedPayments });
    },
  });
}
