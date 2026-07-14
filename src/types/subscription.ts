export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  perks: string[];
  isPopular?: boolean;
}

export type PaymentMethod = "momo" | "vnpay" | "zalopay" | "card";

export interface CheckoutPayload {
  planId: string;
  provider: PaymentMethod;
  couponCode?: string;
}
