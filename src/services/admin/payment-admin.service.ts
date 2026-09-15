import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { BankTransaction } from "@/types/subscription";

export const paymentAdminService = {
  async listUnmatched(): Promise<BankTransaction[]> {
    const { data } = await apiClient.get<ApiResponse<BankTransaction[]>>(
      ENDPOINTS.payments.adminUnmatched
    );
    return data.data;
  },

  async approve(refCode: string): Promise<void> {
    await apiClient.post(ENDPOINTS.payments.adminApprove(refCode));
  },

  async scan(): Promise<{ scanned: number }> {
    const { data } = await apiClient.post<ApiResponse<{ scanned: number }>>(
      ENDPOINTS.payments.adminScan
    );
    return data.data;
  },
};
