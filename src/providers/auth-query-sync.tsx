"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { QUERY_KEYS } from "@/constants/query-keys";

/** Shorts responses bake per-user `isLiked`/`isSaved` flags directly into
 * the cached feed array instead of a separate "my likes" query, so a login
 * or logout must force a refetch — otherwise the feed keeps rendering flags
 * fetched under a different identity (or none) for up to `staleTime`,
 * showing a signed-in user's likes as guest, or a new session's feed still
 * lit up from whoever was signed in before. */
export function AuthQuerySync() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const previous = useRef(isAuthenticated);

  useEffect(() => {
    if (previous.current === isAuthenticated) return;
    previous.current = isAuthenticated;

    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shortsFeed });

    // These are gated by `enabled: isAuthenticated` and hold nothing
    // meaningful for a guest — drop the cached value outright instead of
    // just marking it stale, since a disabled query never auto-refetches.
    queryClient.removeQueries({ queryKey: QUERY_KEYS.savedShorts });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.favorites });
  }, [isAuthenticated, queryClient]);

  return null;
}
