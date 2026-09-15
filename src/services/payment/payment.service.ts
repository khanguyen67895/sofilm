import { apiClient, ENDPOINTS } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { CheckoutPayload, CheckoutResult, Invoice, PaymentStatusResult } from "@/types/subscription";

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

  /** Polled every few seconds while a bank-transfer checkout is pending. */
  async getStatus(invoiceId: string): Promise<PaymentStatusResult> {
    const { data } = await apiClient.get<ApiResponse<PaymentStatusResult>>(
      ENDPOINTS.payments.status(invoiceId)
    );
    return data.data;
  },
};
