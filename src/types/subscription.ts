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

export interface CheckoutPayload {
  planId: string;
  couponCode?: string;
}

/** Bank-transfer (SePay/VietQR) checkout session — the only real payment
 * method today (see checkout-view.tsx's PAYMENT_METHODS). */
export interface CheckoutResult {
  invoiceId: string;
  refCode: string;
  qrUrl: string;
  bankAccount: string;
  bankAccountName: string;
  bankName: string;
  expiresAt: string;
}

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentStatusResult extends CheckoutResult {
  status: InvoiceStatus;
}

/** An uncredited bank transaction observed via SePay (webhook or scan) that
 * couldn't be auto-matched to a pending invoice — admin reviews these at
 * /admin/payments. */
export interface BankTransaction {
  id: string;
  amount: number;
  description: string;
  referenceCode?: string;
  transactionDate: string;
  credited: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  plan: SubscriptionPlan;
}
