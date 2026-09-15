import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutView } from "@/features/subscription/components/checkout-view";

// Transactional/authenticated page — no content value to a crawler, and
// indexing it would just be another page duplicating the site-wide title.
export const metadata: Metadata = {
  title: "Checkout | SoFilm",
  robots: { index: false, follow: false },
};

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutView />
    </Suspense>
  );
}
