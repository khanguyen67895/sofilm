"use client";

import { useQuery } from "@tanstack/react-query";
import { bannerAdminService } from "@/services/admin/banner-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useAdminBanners() {
  return useQuery({
    queryKey: QUERY_KEYS.adminBanners,
    queryFn: () => bannerAdminService.listAll(),
  });
}
