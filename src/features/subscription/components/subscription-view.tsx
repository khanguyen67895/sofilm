"use client";

import Image from "next/image";
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
      <Reveal className="relative overflow-hidden rounded-3xl px-6 py-10 text-center">
        <Image
          src="/image/ic_bg_footer.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover object-bottom-left opacity-25"
        />
        <h1 className="relative text-3xl font-extrabold text-white">
          Choose the Plan That Fits You
        </h1>
        <p className="relative mt-2 text-white/60">
          Upgrade to Premium for unlimited streaming, an ad-free experience, and stunning 4K
          quality.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
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
