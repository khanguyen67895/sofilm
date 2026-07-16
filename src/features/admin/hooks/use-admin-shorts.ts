"use client";

import { useQuery } from "@tanstack/react-query";
import { shortAdminService } from "@/services/admin/short-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminShorts(page: number) {
  return useQuery({
    queryKey: QUERY_KEYS.adminShorts(page),
    queryFn: () => shortAdminService.listShorts(page),
  });
}
