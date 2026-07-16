"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortAdminService } from "@/services/admin/short-admin.service";
import type { CreateShortPayload } from "@/types/shorts";

export function useCreateShort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShortPayload) => shortAdminService.createShort(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "shorts"] });
    },
  });
}
