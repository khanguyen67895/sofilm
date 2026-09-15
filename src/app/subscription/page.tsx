import type { Metadata } from "next";
import { SubscriptionView } from "@/features/subscription/components/subscription-view";

export const metadata: Metadata = {
  title: "Subscription Plans | SoFilm",
  description: "Compare SoFilm's VIP subscription plans and pricing to unlock the full movie and series library.",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
