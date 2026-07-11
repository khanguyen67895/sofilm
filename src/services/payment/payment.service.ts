import { apiClient, ENDPOINTS } from "@/services/api";
import { MOCK_PLANS } from "@/lib/mock-data";
import type { ApiResponse } from "@/types/api";
import type { CheckoutPayload, SubscriptionPlan } from "@/types/subscription";

export const paymentService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    // TODO: swap for a real endpoint once billing is wired up.
    // const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(ENDPOINTS.subscription.plans);
    // return data.data;
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_PLANS;
  },

  async checkout(payload: CheckoutPayload) {
    const { data } = await apiClient.post<ApiResponse<{ redirectUrl: string }>>(
      ENDPOINTS.payment.checkout,
      payload
    );
    return data.data;
  },

  async getHistory() {
    const { data } = await apiClient.get<ApiResponse<unknown[]>>(
      ENDPOINTS.payment.history
    );
    return data.data;
  },
};
