"use client";

import { useQuery } from "@tanstack/react-query";
import { shortAdminService } from "@/services/admin/short-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminShortDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adminShortDetail(id),
    queryFn: () => shortAdminService.getShortById(id),
    enabled: Boolean(id),
  });
}
