"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortAdminService } from "@/services/admin/short-admin.service";
import type { UpdateShortPayload } from "@/types/shorts";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useUpdateShort(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShortPayload) => shortAdminService.updateShort(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminShortDetail(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "shorts"] });
    },
  });
}
