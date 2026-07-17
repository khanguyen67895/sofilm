"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";

/** Blocking gate shown over the homepage for guests — no dismiss/backdrop
 * close by design, the only way out is picking Login or Register. Body
 * scroll is locked while it's up so the page underneath can't be scrolled
 * through the overlay. */
export function HomeAuthGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mounted = useHydrated();
  const show = mounted && !isAuthenticated;

  useEffect(() => {
    if (!show) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-auth-gate-title"
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center"
      >
        <div className="space-y-1.5">
          <h2
            id="home-auth-gate-title"
            className="font-heading text-xl font-bold tracking-wide text-white uppercase"
          >
            Chào Mừng Đến <span className="text-brand">SoFilm</span>
          </h2>
          <p className="text-sm text-white/60">
            Đăng nhập hoặc tạo tài khoản để bắt đầu xem phim.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href={ROUTES.login} className="w-full">
            <Button className="w-full">Đăng Nhập</Button>
          </Link>
          <Link href={ROUTES.register} className="w-full">
            <Button variant="outline" className="w-full">
              Đăng Ký
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
