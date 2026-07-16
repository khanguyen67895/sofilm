"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { formatBillingCycle } from "@/utils/format";
import type { SubscriptionPlan } from "@/types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  selected?: boolean;
}

function PlanCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        opacity="0.4"
        d="M1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12Z"
        fill="var(--color-brand)"
      />
      <path
        d="M16.8775 8.02038C17.1425 8.50493 16.9645 9.11257 16.48 9.37756C15.1086 10.1275 13.8208 11.6975 12.8374 13.2032C12.3581 13.9372 11.9735 14.6207 11.709 15.1204C11.577 15.3697 11.4756 15.5721 11.4079 15.7105L11.3096 15.9159C11.1551 16.2536 10.8261 16.4782 10.4553 16.4987C10.0844 16.5191 9.73267 16.3323 9.54198 16.0135C9.23126 15.494 8.73753 15.0198 8.27997 14.6581C8.05764 14.4823 7.85752 14.3437 7.71471 14.2502L7.50442 14.1187C7.02493 13.8449 6.85797 13.2344 7.13152 12.7548C7.40513 12.275 8.01585 12.1079 8.49559 12.3815L8.81063 12.5772C8.99282 12.6965 9.2427 12.8697 9.52038 13.0892C9.73258 13.257 9.96984 13.4587 10.2094 13.6911C10.4662 13.2297 10.7872 12.685 11.1629 12.1096C12.1796 10.5529 13.6917 8.62286 15.5204 7.62282C16.0049 7.35782 16.6125 7.53582 16.8775 8.02038Z"
        fill="var(--color-brand)"
      />
    </svg>
  );
}

export function PlanCard({ plan, onSelect, selected }: PlanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "card-glass relative flex flex-col gap-4 rounded-3xl p-6",
        selected && "border-brand"
      )}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-lg border border-brand bg-brand px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
      <p className="text-3xl font-extrabold text-white">
        {plan.price.toLocaleString("vi-VN")}
        <span className="text-lg font-normal text-white/50">đ</span>
        <span className="text-sm font-normal text-white/50">
          {formatBillingCycle(plan.durationDays)}
        </span>
      </p>
      <ul className="space-y-2">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-white/70">
            <PlanCheckIcon /> {perk}
          </li>
        ))}
      </ul>
      <Button
        variant={plan.tier === "VIP" || selected ? "primary" : "outline"}
        onClick={() => onSelect(plan)}
        className="mt-auto"
      >
        Choose This Plan
      </Button>
    </motion.div>
  );
}
