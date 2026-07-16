"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortAdminService } from "@/services/admin/short-admin.service";

export function useDeleteShort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shortAdminService.deleteShort(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "shorts"] });
    },
  });
}
