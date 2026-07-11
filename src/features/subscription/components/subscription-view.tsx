"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/common/reveal";
import { usePlans } from "../hooks/use-plans";
import { useCheckout } from "../hooks/use-checkout";
import { PlanCard } from "./plan-card";

export function SubscriptionView() {
  const { data: plans, isLoading } = usePlans();
  const checkout = useCheckout();

  return (
    <div className="space-y-8 px-4 py-12 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Chọn Gói VIP</h1>
        <p className="mt-2 text-white/60">
          Mở khoá kho phim và series không giới hạn, chất lượng cao nhất.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : (
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {plans?.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPending={checkout.isPending}
              onSelect={(selected) =>
                checkout.mutate({ planId: selected.id, method: "vnpay" })
              }
            />
          ))}
        </Reveal>
      )}
    </div>
  );
}
