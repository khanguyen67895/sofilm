import { useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { useHydrated } from "./use-hydrated";

/**
 * Gate for login-only actions (upgrade, premium video, comment, like,
 * share, ...). Guests get the LoginRequiredModal instead of the action
 * running; logged-in users run it immediately. Returns whether the action
 * ran, in case a caller needs to short-circuit (e.g. skip an optimistic
 * update).
 */
export function useRequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();
  const openLoginPrompt = useUiStore((s) => s.openLoginPrompt);

  return useCallback(
    (action: () => void, message?: string): boolean => {
      if (mounted && isAuthenticated) {
        action();
        return true;
      }
      openLoginPrompt(message);
      return false;
    },
    [mounted, isAuthenticated, openLoginPrompt]
  );
}
