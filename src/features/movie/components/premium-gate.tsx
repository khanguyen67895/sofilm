"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function PremiumGate({ backdrop }: { backdrop: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {backdrop && (
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
          <h3 className="text-xl font-bold text-white">Nội Dung Premium</h3>
          <p className="text-sm text-white/70">
            Nâng cấp gói VIP để xem phim này và toàn bộ kho phim cao cấp.
          </p>
        </div>
        <Link href={ROUTES.subscription}>
          <Button variant="primary">Nâng Cấp Ngay</Button>
        </Link>
      </motion.div>
    </div>
  );
}
