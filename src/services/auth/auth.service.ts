import { apiClient, ENDPOINTS } from "@/services/api";
import type {
  AuthIdentity,
  AuthTokens,
  LoginPayload,
  RequestPhoneOtpPayload,
  VerifyPhoneOtpPayload,
  User,
} from "@/types/user";
import type { ApiResponse } from "@/types/api";

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      ENDPOINTS.auth.login,
      payload
    );
    return data.data;
  },

  async requestPhoneOtp(payload: RequestPhoneOtpPayload) {
    await apiClient.post(ENDPOINTS.auth.otpPhoneRequest, payload);
  },

  async verifyPhoneOtp(payload: VerifyPhoneOtpPayload) {
    const { data } = await apiClient.post<ApiResponse<{ user: User } & AuthTokens>>(
      ENDPOINTS.auth.otpPhoneVerify,
      payload
    );
    return data.data;
  },

  async logout() {
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  /** GET /auth/me returns the decoded JWT payload, not a full profile — use
   * ENDPOINTS.users.me for the actual Profile record. */
  async getMe() {
    const { data } = await apiClient.get<ApiResponse<AuthIdentity>>(ENDPOINTS.auth.me);
    return data.data;
  },
};
