"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";

export function AdminGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  // `isAuthenticated`/`isAdmin` come from a localStorage-persisted store,
  // which is unavailable during SSR — gate on hydration so the client's
  // first render matches the server's logged-out shape instead of
  // hydration-mismatching.
  const mounted = useHydrated();

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 px-4 py-20 text-center"
      >
        <p className="text-white/70">Bạn cần đăng nhập để truy cập trang quản trị.</p>
        <Link href={ROUTES.adminLogin}>
          <Button>Đăng Nhập</Button>
        </Link>
      </motion.div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 px-4 py-20 text-center"
      >
        <p className="text-white/70">Bạn không có quyền truy cập trang này.</p>
        <Link href={ROUTES.home}>
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </motion.div>
    );
  }

  return <>{children}</>;
}
