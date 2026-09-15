import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccessView } from "@/features/subscription/components/payment-success-view";

export const metadata: Metadata = {
  title: "Payment Successful | SoFilm",
  robots: { index: false, follow: false },
};

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessView />
    </Suspense>
  );
}
