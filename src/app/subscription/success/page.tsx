import { Suspense } from "react";
import { PaymentSuccessView } from "@/features/subscription/components/payment-success-view";

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessView />
    </Suspense>
  );
}
