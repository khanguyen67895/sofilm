import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { CheckoutPayload, CheckoutResult, Invoice } from "@/types/subscription";

export const paymentService = {
  async checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
    const { data } = await apiClient.post<ApiResponse<CheckoutResult>>(
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

  async verify(invoiceId: string): Promise<Invoice> {
    const { data } = await apiClient.get<ApiResponse<Invoice>>(
      ENDPOINTS.payments.verify(invoiceId)
    );
    return data.data;
  },

  /** Demo-only stand-in for a real gateway webhook — see PaymentService.confirmPayment
   * on the backend. Marks the invoice paid and activates the subscription. */
  async confirm(invoiceId: string): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<ApiResponse<{ success: boolean }>>(
      ENDPOINTS.payments.confirm(invoiceId)
    );
    return data.data;
  },
};
