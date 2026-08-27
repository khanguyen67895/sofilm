"use client";

import { useRouter } from "next/navigation";
import { Reveal } from "@/components/common/reveal";
import { ROUTES } from "@/constants/routes";
import { useRequireAuth } from "@/hooks/use-require-auth";
import type { SubscriptionPlan } from "@/types/subscription";
import { PLANS } from "../constants";
import { PlanCard } from "./plan-card";

export function SubscriptionView() {
  const router = useRouter();
  const requireAuth = useRequireAuth();

  function selectPlan(plan: SubscriptionPlan) {
    requireAuth(
      () => router.push(ROUTES.subscriptionCheckout(plan.id)),
      "Sign in to subscribe to a VIP plan."
    );
  }

  return (
    <div className="space-y-8 px-6 py-12 sm:px-8 lg:px-20">
      <Reveal className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Choose the Plan That Fits You</h1>
        <p className="mt-2 text-white/60">
          Upgrade to Premium for unlimited streaming, an ad-free experience, and stunning 4K
          quality.
        </p>
      </Reveal>

      <Reveal className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={selectPlan} />
        ))}
      </Reveal>

      <p className="text-center text-sm text-white/40">
        Secure payments via Stripe, VNPay, and MoMo. Cancel anytime.
      </p>
    </div>
  );
}
