import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuthTokens } from "@/types/user";

/** Unauthenticated auth endpoints — a 401 from these means "wrong credentials"
 * or "invalid/expired token", not "session expired". They must never trigger
 * the refresh-token flow or the hard redirect below, otherwise a wrong
 * password on the login screen itself bounces the user off their own login
 * form before the inline error can render. */
const SKIP_REFRESH_PATHS: string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.refresh,
  ENDPOINTS.auth.otpPhoneRequest,
  ENDPOINTS.auth.otpPhoneVerify,
];

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      SKIP_REFRESH_PATHS.includes(originalRequest?.url ?? "")
    ) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") return Promise.reject(error);

    // Already on a login screen — let that screen's own error handling show
    // the 401 inline instead of hard-reloading it out from under the user.
    const onLoginScreen =
      window.location.pathname.startsWith("/auth/") ||
      window.location.pathname.startsWith("/admin/login");
    if (onLoginScreen) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    // No refresh token means there was never a session to refresh — a guest,
    // or someone who already signed out — not a session that just expired.
    // Reject and let the caller show its own "sign in required" state
    // instead of hard-redirecting a logged-out user away from whatever page
    // they're just browsing; the catch block below is for a real session
    // that failed to refresh, which does warrant sending them to login.
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<ApiResponse<AuthTokens>>(
        `${API_CONFIG.baseURL}/auth/refresh`,
        { refreshToken }
      );

      localStorage.setItem(AUTH_TOKEN_KEY, data.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);

      pendingQueue.forEach((resolve) => resolve());
      pendingQueue = [];

      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.href = window.location.pathname.startsWith("/admin")
        ? "/admin/login"
        : "/auth/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
