"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerAdminService } from "@/services/admin/banner-admin.service";
import type { BannerPayload } from "@/types/banner";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useUpdateBanner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<BannerPayload>) => bannerAdminService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners });
    },
  });
}
