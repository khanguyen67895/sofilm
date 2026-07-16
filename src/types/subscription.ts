export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  price: number;
  currency: string;
  durationDays: number;
  perks: string[];
  isPopular?: boolean;
}

/** Actual gateway the backend knows how to talk to (payment-provider.factory.ts) —
 * the on-screen payment method list has more options than this because a couple
 * of them (bank transfer, international card) route through one of these same
 * providers under a different label. */
export type PaymentProvider = "momo" | "vnpay" | "zalopay" | "stripe";

export interface CheckoutPayload {
  planId: string;
  provider: PaymentProvider;
  couponCode?: string;
}

export interface CheckoutResult {
  invoiceId: string;
  redirectUrl: string;
}

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  plan: SubscriptionPlan;
}
