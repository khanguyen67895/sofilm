"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerAdminService } from "@/services/admin/banner-admin.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerAdminService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminBanners });
    },
  });
}
