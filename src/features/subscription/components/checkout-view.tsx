"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Check, Clock, CreditCard, Crown, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/utils/cn";
import { formatBillingCycle, formatCountdown, formatCurrency } from "@/utils/format";
import type { CheckoutResult, SubscriptionPlan } from "@/types/subscription";
import { PLANS } from "../constants";
import { useCheckout } from "../hooks/use-checkout";
import { usePaymentStatus } from "../hooks/use-payment-status";

interface PaymentMethodOption {
  id: string;
  label: string;
  description: string;
  icon: typeof Smartphone;
  color: string;
  disabled?: boolean;
}

// Bank transfer (SePay + VietQR) is the only real payment rail today — the
// rest are shown for parity with the reference design but disabled, matching
// taothao_ai_training's own checkout ("Sắp ra mắt" on every method but bank).
const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    description: "Scan the QR code with your banking app",
    icon: Building2,
    color: "bg-brand",
  },
  {
    id: "momo",
    label: "MoMo",
    description: "Coming soon",
    icon: Smartphone,
    color: "bg-pink-500",
    disabled: true,
  },
  {
    id: "vnpay",
    label: "VNPay",
    description: "Coming soon",
    icon: CreditCard,
    color: "bg-blue-500",
    disabled: true,
  },
  {
    id: "card",
    label: "International Credit Card",
    description: "Coming soon",
    icon: Wallet,
    color: "bg-indigo-500",
    disabled: true,
  },
  {
    id: "zalopay",
    label: "ZaloPay",
    description: "Coming soon",
    icon: Smartphone,
    color: "bg-sky-500",
    disabled: true,
  },
];

function useCountdown(expiresAt: string | undefined) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();
    const tick = () => setSecondsLeft(Math.max(0, Math.round((target - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return secondsLeft;
}

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = useCheckout();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();
  const openLoginPrompt = useUiStore((s) => s.openLoginPrompt);

  const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get("planId") ?? "");
  const [selectedMethodId, setSelectedMethodId] = useState(PAYMENT_METHODS[0].id);
  const [session, setSession] = useState<CheckoutResult | null>(null);

  const paymentStatus = usePaymentStatus(session?.invoiceId);
  const secondsLeft = useCountdown(session?.expiresAt);

  // Guests can only land here by typing the URL directly (the normal entry
  // point, choosing a plan on /subscription, is already gated) — bounce
  // them back with the login popup instead of letting checkout render.
  useEffect(() => {
    if (!mounted || isAuthenticated) return;
    openLoginPrompt("Sign in to continue with payment.");
    router.replace(ROUTES.subscription);
  }, [mounted, isAuthenticated, router, openLoginPrompt]);

  useEffect(() => {
    if (paymentStatus.data?.status === "PAID" && session) {
      router.push(ROUTES.subscriptionSuccess(session.invoiceId));
    }
  }, [paymentStatus.data?.status, session, router]);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0];
  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === selectedMethodId) ?? PAYMENT_METHODS[0];
  const isExpiredOrFailed =
    paymentStatus.data?.status === "FAILED" || (Boolean(session) && secondsLeft === 0 && paymentStatus.data?.status === "PENDING");

  function selectPlan(plan: SubscriptionPlan) {
    setSelectedPlanId(plan.id);
  }

  function selectMethod(method: PaymentMethodOption) {
    if (method.disabled) return;
    setSelectedMethodId(method.id);
  }

  function retry() {
    setSession(null);
    checkout.reset();
  }

  if (mounted && !isAuthenticated) return null;

  async function handleCompletePayment() {
    if (!selectedPlan || selectedMethod.disabled) return;
    try {
      const result = await checkout.mutateAsync({ planId: selectedPlan.id });
      setSession(result);
    } catch {
      // surfaced via checkout.isError below
    }
  }

  return (
    <div className="space-y-8 px-6 py-12 sm:px-8 lg:px-20">
      <Reveal className="text-center">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          Choose a package and make a payment.
        </h1>
        <p className="mt-2 text-white/60">
          You&apos;re one step away from unlimited movies, anywhere, anytime.
        </p>
      </Reveal>

      <Reveal className="grid gap-3 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlan?.id;
          return (
            <button
              key={plan.id}
              type="button"
              disabled={Boolean(session)}
              onClick={() => selectPlan(plan)}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors disabled:opacity-50",
                isSelected ? "border-brand bg-brand/10" : "border-white/10 bg-white/5"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-3 w-3 shrink-0 rounded-full border-2",
                    isSelected ? "border-brand bg-brand" : "border-white/40"
                  )}
                />
                <span className="text-sm text-white/80">{plan.name}</span>
              </div>
              <p className="mt-1 text-6xl font-bold text-white">
                {formatCurrency(plan.price, plan.currency)}
                <span className="text-sm font-normal text-white/50">
                  {formatBillingCycle(plan.durationDays)}
                </span>
              </p>
            </button>
          );
        })}
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Reveal delay={0.1} className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Choose a payment method</h2>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = method.id === selectedMethodId;
            const Icon = method.icon;
            return (
              <div key={method.id}>
                <button
                  type="button"
                  disabled={method.disabled || Boolean(session)}
                  onClick={() => selectMethod(method)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    method.disabled
                      ? "cursor-not-allowed border-white/5 bg-white/5 opacity-50"
                      : isSelected
                        ? "border-brand bg-brand/10"
                        : "border-white/10 bg-white/5 disabled:opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected && !method.disabled ? "border-brand" : "border-white/40"
                    )}
                  >
                    {isSelected && !method.disabled && (
                      <span className="h-2 w-2 rounded-full bg-brand" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white",
                      method.color
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="flex-1">
                    <p className="text-sm font-medium text-white">{method.label}</p>
                    <p className="text-xs text-white/50">{method.description}</p>
                  </span>
                  {method.disabled && (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase text-white/50">
                      Coming soon
                    </span>
                  )}
                </button>

                {isSelected && !method.disabled && session && (
                  <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-brand/40 bg-white/5 p-4 sm:flex-row sm:items-start sm:text-left">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image src={session.qrUrl} alt="Bank transfer QR code" fill className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <ol className="list-inside list-decimal space-y-1 text-xs text-white/60">
                        <li>Open your banking app</li>
                        <li>Scan the QR code on the left</li>
                        <li>
                          Or transfer manually to{" "}
                          <span className="text-white/80">{session.bankAccount}</span> (
                          {session.bankAccountName}, {session.bankName})
                        </li>
                        <li>
                          Keep the transfer note exactly:{" "}
                          <span className="font-mono text-white/80">{session.refCode}</span>
                        </li>
                      </ol>
                      {isExpiredOrFailed ? (
                        <p className="text-xs text-red-400">
                          This QR code has expired. Please try again.
                        </p>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <Clock size={12} /> {formatCountdown(secondsLeft)} QR code expires in
                        </div>
                      )}
                      <p className="text-[11px] text-white/40">
                        After payment, your account will be automatically activated within 1-2
                        minutes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.15} className="h-fit space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-sm font-semibold text-white/70">Selected Plan</h3>
          {selectedPlan && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <Crown size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedPlan.name}</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                    <span className="text-sm font-normal text-white/50">
                      {formatBillingCycle(selectedPlan.durationDays)}
                    </span>
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {selectedPlan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs text-white/70">
                    <Check size={14} className="text-brand" /> {perk}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-white/60">Total Payment:</span>
                <span className="text-xl font-bold text-green-500">
                  {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                </span>
              </div>
              {isExpiredOrFailed ? (
                <Button onClick={retry} className="w-full">
                  Try Again
                </Button>
              ) : session ? (
                <Button disabled className="w-full">
                  Waiting for payment...
                </Button>
              ) : (
                <Button onClick={handleCompletePayment} disabled={checkout.isPending} className="w-full">
                  {checkout.isPending ? "Processing..." : "Complete Payment"}
                </Button>
              )}
              {checkout.isError && (
                <p className="text-center text-xs text-red-500">
                  Payment failed. Please try again.
                </p>
              )}
              <p className="text-center text-[11px] text-white/40">
                By clicking &quot;Complete Payment,&quot; you agree to the Terms & Refund Policy.
              </p>
            </>
          )}
        </Reveal>
      </div>
    </div>
  );
}
