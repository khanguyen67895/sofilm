import { Suspense } from "react";
import { CheckoutView } from "@/features/subscription/components/checkout-view";

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutView />
    </Suspense>
  );
}
