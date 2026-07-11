"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { SubscriptionPlan } from "@/types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isPending?: boolean;
}

export function PlanCard({ plan, onSelect, isPending }: PlanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6",
        plan.isPopular && "border-red-500 bg-red-600/10"
      )}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Phổ Biến Nhất
        </span>
      )}
      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
      <p className="text-3xl font-extrabold text-white">
        {formatCurrency(plan.price, plan.currency)}
        <span className="text-sm font-normal text-white/50">
          {" "}
          / {plan.durationDays} ngày
        </span>
      </p>
      <ul className="space-y-2">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-white/70">
            <Check size={16} className="text-red-500" /> {perk}
          </li>
        ))}
      </ul>
      <Button onClick={() => onSelect(plan)} disabled={isPending} className="mt-auto">
        Chọn Gói Này
      </Button>
    </motion.div>
  );
}
