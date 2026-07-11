import { apiClient, ENDPOINTS } from "@/services/api";
import type { AuthTokens, LoginPayload, RegisterPayload, User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      ENDPOINTS.auth.login,
      payload
    );
    return data.data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      ENDPOINTS.auth.register,
      payload
    );
    return data.data;
  },

  async logout() {
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  async getMe() {
    const { data } = await apiClient.get<ApiResponse<User>>(ENDPOINTS.auth.me);
    return data.data;
  },
};
