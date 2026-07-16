import type { SubscriptionPlan } from "@/types/subscription";

/**
 * Hardcoded in the UI on purpose — plan list/pricing rarely changes and
 * doesn't need a network round-trip to render. The `id`s below are fixed
 * UUIDs seeded into the backend's `subscription_plans` table by
 * `sofilm_backend/apps/payment/src/scripts/seed-plans.script.ts` (run once via
 * `npm run seed:plans`), so checkout still resolves a real DB row for each.
 */
export const PLANS: SubscriptionPlan[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Monthly Plan",
    tier: "PREMIUM",
    price: 79000,
    currency: "VND",
    durationDays: 30,
    perks: ["Unlimited streaming", "Full HD quality", "Watch on up to 2 devices", "Ad-free experience"],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Annual Plan",
    tier: "PREMIUM",
    price: 699000,
    currency: "VND",
    durationDays: 365,
    perks: [
      "Unlimited streaming",
      "4K Ultra HD quality",
      "Watch on up to 4 devices",
      "Ad-free experience",
      "Download for offline viewing",
      "Save 27% compared to the monthly plan",
    ],
    isPopular: true,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "VIP Plan",
    tier: "VIP",
    price: 1199000,
    currency: "VND",
    durationDays: 365,
    perks: [
      "Everything in the Annual Plan",
      "Up to 8K quality (where available)",
      "Unlimited devices",
      "Early access to new releases",
      "24/7 priority support",
      "Complimentary Mobile Plan",
    ],
    isPopular: true,
  },
];
