"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/common/reveal";
import { ROUTES } from "@/constants/routes";
import { formatBillingCycle, formatCurrency } from "@/utils/format";
import { useInvoice } from "../hooks/use-invoice";

export function PaymentSuccessView() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId") ?? "";
  const { data: invoice, isLoading } = useInvoice(invoiceId);

  if (isLoading || !invoice) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-12 text-center">
      <Reveal className="space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand"
        >
          <Check size={32} className="text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Payment successful</h1>
          <p className="mt-1 text-sm text-white/60">
            You&apos;re one step away from unlimited movies, anywhere, anytime.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
            <Crown size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{invoice.plan.name}</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(invoice.amount, invoice.currency)}
              <span className="text-xs font-normal text-white/50">
                {formatBillingCycle(invoice.plan.durationDays)}
              </span>
            </p>
          </div>
        </div>
        <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/50">
          Payment date:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <Link href={ROUTES.home}>
          <Button className="w-full">Start Watching</Button>
        </Link>
      </Reveal>
    </div>
  );
}
