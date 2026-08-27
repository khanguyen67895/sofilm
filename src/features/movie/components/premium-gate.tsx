"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { isValidImageSrc } from "@/utils/image";

export function PremiumGate({ backdrop }: { backdrop: string }) {
  const router = useRouter();
  const requireAuth = useRequireAuth();

  function handleUpgrade() {
    requireAuth(
      () => router.push(ROUTES.subscription),
      "Sign in to upgrade to VIP."
    );
  }

  return (
    <div className="relative h-65 w-full overflow-hidden rounded-xl bg-black sm:h-156.75">
      {isValidImageSrc(backdrop) && (
        <Image
          src={backdrop}
          alt=""
          fill
          className="object-cover opacity-30 blur-sm"
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-4 text-center"
      >
        <Crown size={40} className="text-brand" />
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Premium Content</h3>
          <p className="text-sm text-white/70">
            Upgrade to VIP to watch this movie and unlock our entire premium library.
          </p>
        </div>
        <Button variant="primary" onClick={handleUpgrade}>
          Upgrade Now
        </Button>
      </motion.div>
    </div>
  );
}
