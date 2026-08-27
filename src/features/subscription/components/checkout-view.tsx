"use client";

import { useEffect, useState } from "react";
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
import type { PaymentProvider, SubscriptionPlan } from "@/types/subscription";
import { PLANS } from "../constants";
import { useCheckout } from "../hooks/use-checkout";
import { useConfirmPayment } from "../hooks/use-confirm-payment";

const QR_COUNTDOWN_SECONDS = 336; // 05:36, matching the reference design

interface PaymentMethodOption {
  id: string;
  provider: PaymentProvider;
  label: string;
  description: string;
  icon: typeof Smartphone;
  color: string;
  showQr?: boolean;
}

// Only 4 real gateways exist on the backend (payment-provider.factory.ts) — Bank
// Transfer has no dedicated provider in Vietnam's ecosystem here, so it rides on
// VNPay same as the VNPay option itself, just with different on-screen copy.
const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "momo",
    provider: "momo",
    label: "MoMo",
    description: "Scan QR code",
    icon: Smartphone,
    color: "bg-pink-500",
    showQr: true,
  },
  {
    id: "vnpay",
    provider: "vnpay",
    label: "VNPay",
    description: "Domestic ATM · Visa · Mastercard",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    id: "bank-transfer",
    provider: "vnpay",
    label: "Bank Transfer",
    description: "Vietcombank · BIDV, ...",
    icon: Building2,
    color: "bg-slate-500",
  },
  {
    id: "card",
    provider: "stripe",
    label: "International Credit Card",
    description: "Visa · Mastercard · JCB",
    icon: Wallet,
    color: "bg-indigo-500",
  },
  {
    id: "zalopay",
    provider: "zalopay",
    label: "ZaloPay",
    description: "Linked ZaloPay Wallet",
    icon: Smartphone,
    color: "bg-sky-500",
  },
];

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = useCheckout();
  const confirmPayment = useConfirmPayment();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();
  const openLoginPrompt = useUiStore((s) => s.openLoginPrompt);

  const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get("planId") ?? "");
  const [selectedMethodId, setSelectedMethodId] = useState(PAYMENT_METHODS[0].id);
  const [secondsLeft, setSecondsLeft] = useState(QR_COUNTDOWN_SECONDS);

  // Guests can only land here by typing the URL directly (the normal entry
  // point, choosing a plan on /subscription, is already gated) — bounce
  // them back with the login popup instead of letting checkout render.
  useEffect(() => {
    if (!mounted || isAuthenticated) return;
    openLoginPrompt("Sign in to continue with payment.");
    router.replace(ROUTES.subscription);
  }, [mounted, isAuthenticated, router, openLoginPrompt]);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0];
  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === selectedMethodId) ?? PAYMENT_METHODS[0];
  const isPending = checkout.isPending || confirmPayment.isPending;
  const hasError = checkout.isError || confirmPayment.isError;

  // Ticking down is a legitimate effect (subscribing to an external timer);
  // resetting the count on method change happens in selectMethod below
  // instead, synchronously with the click that causes it.
  useEffect(() => {
    if (!selectedMethod.showQr) return;
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [selectedMethodId, selectedMethod.showQr]);

  function selectPlan(plan: SubscriptionPlan) {
    setSelectedPlanId(plan.id);
  }

  function selectMethod(method: PaymentMethodOption) {
    setSelectedMethodId(method.id);
    if (method.showQr) setSecondsLeft(QR_COUNTDOWN_SECONDS);
  }

  if (mounted && !isAuthenticated) return null;

  async function handleCompletePayment() {
    if (!selectedPlan) return;
    try {
      const { invoiceId } = await checkout.mutateAsync({
        planId: selectedPlan.id,
        provider: selectedMethod.provider,
      });
      // No provider here has real credentials configured, so no webhook will
      // ever arrive on its own — this simulates the provider confirming the
      // payment (see PaymentService.confirmPayment on the backend).
      await confirmPayment.mutateAsync(invoiceId);
      router.push(ROUTES.subscriptionSuccess(invoiceId));
    } catch {
      // surfaced via hasError below
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
              onClick={() => selectPlan(plan)}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
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
                  onClick={() => selectMethod(method)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    isSelected ? "border-brand bg-brand/10" : "border-white/10 bg-white/5"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-brand" : "border-white/40"
                    )}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </span>
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white",
                      method.color
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <span>
                    <p className="text-sm font-medium text-white">{method.label}</p>
                    <p className="text-xs text-white/50">{method.description}</p>
                  </span>
                </button>

                {isSelected && method.showQr && (
                  <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-brand/40 bg-white/5 p-4 sm:flex-row sm:items-start sm:text-left">
                    <div className="h-32 w-32 shrink-0 rounded-md bg-white/10" />
                    <div className="space-y-2">
                      <ol className="list-inside list-decimal space-y-1 text-xs text-white/60">
                        <li>Open the MoMo app on your phone</li>
                        <li>Select &quot;Scan QR Code&quot;</li>
                        <li>Scan the QR code on the left</li>
                        <li>Confirm the amount and complete the payment</li>
                      </ol>
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <Clock size={12} /> {formatCountdown(secondsLeft)} QR code expires in
                      </div>
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
              <Button onClick={handleCompletePayment} disabled={isPending} className="w-full">
                {isPending ? "Processing..." : "Complete Payment"}
              </Button>
              {hasError && (
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
