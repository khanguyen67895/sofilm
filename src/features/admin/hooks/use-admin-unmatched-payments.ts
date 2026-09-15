"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentAdminService } from "@/services/admin/payment-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminUnmatchedPayments() {
  return useQuery({
    queryKey: QUERY_KEYS.adminUnmatchedPayments,
    queryFn: () => paymentAdminService.listUnmatched(),
  });
}
