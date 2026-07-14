import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { CheckoutPayload, SubscriptionPlan } from "@/types/subscription";

export const paymentService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
      ENDPOINTS.subscriptions.plans
    );
    return data.data;
  },

  async checkout(payload: CheckoutPayload) {
    const { data } = await apiClient.post<ApiResponse<{ invoiceId: string; redirectUrl: string }>>(
      ENDPOINTS.payments.checkout,
      payload
    );
    return data.data;
  },

  async getHistory() {
    const { data } = await apiClient.get<ApiResponse<{ items: unknown[] }>>(
      ENDPOINTS.payments.history
    );
    return data.data.items;
  },

  async verify(invoiceId: string) {
    const { data } = await apiClient.get<ApiResponse<{ status: string }>>(
      ENDPOINTS.payments.verify(invoiceId)
    );
    return data.data;
  },
};
