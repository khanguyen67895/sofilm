"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerAdminService } from "@/services/admin/banner-admin.service";
import type { BannerPayload } from "@/types/banner";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BannerPayload) => bannerAdminService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners });
    },
  });
}
