"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification/notification.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAuthStore } from "@/store/auth.store";

const POLL_INTERVAL_MS = 60_000;

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: () => notificationService.list(),
    enabled: isAuthenticated,
    // No push infra (no WebSocket gateway) exists yet — poll instead so new
    // movie/short announcements show up without a full page refresh.
    refetchInterval: POLL_INTERVAL_MS,
  });
}
