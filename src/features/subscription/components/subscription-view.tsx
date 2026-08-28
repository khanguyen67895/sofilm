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
    <div className="space-y-8 pb-8">
      <div className="relative -mt-20 overflow-hidden pt-28 pb-10">
        <Image
          src="/image/ic_bg_category.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        {/* Fades the background image into the page's own background color
         * at the bottom edge so the hero blends into the plan cards below
         * instead of hard-cutting into them. */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />

        <Reveal className="relative space-y-2 px-6 text-center sm:px-8 lg:px-20">
          <h1 className="font-heading text-3xl font-bold text-white uppercase">
            Choose the Plan That Fits You
          </h1>
          <p className="text-white/60">
            Upgrade to Premium for unlimited streaming, an ad-free experience, and stunning 4K
            quality.
          </p>
        </Reveal>
      </div>

      <div className="space-y-8 px-6 sm:px-8 lg:px-20">
        <Reveal className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={selectPlan} />
          ))}
        </Reveal>

        <p className="text-center text-sm text-white/40">
          Secure payments via Stripe, VNPay, and MoMo. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
