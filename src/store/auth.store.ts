import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/config";
import type { User } from "@/types/user";

/** Admin sessions are capped at 24h wall-clock from login, independent of the
 * refresh token's own (much longer) validity — enforced by AdminGuard, not
 * here, since regular users have no such cap. */
export const ADMIN_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAt: number | null;
  setSession: (user: User, accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  isAdmin: () => boolean;
  isAdminSessionExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loginAt: null,
      setSession: (user, accessToken, refreshToken) => {
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        set({ user, isAuthenticated: true, loginAt: Date.now() });
      },
      clearSession: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        set({ user: null, isAuthenticated: false, loginAt: null });
      },
      isAdmin: () => get().user?.roles?.includes("ADMIN") ?? false,
      isAdminSessionExpired: () => {
        const { loginAt } = get();
        return Boolean(loginAt) && Date.now() - (loginAt as number) > ADMIN_SESSION_MAX_AGE_MS;
      },
    }),
    {
      name: "sofilm-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginAt: state.loginAt,
      }),
    }
  )
);
