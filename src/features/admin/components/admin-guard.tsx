"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export function AdminGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-white/70">Bạn cần đăng nhập để truy cập trang quản trị.</p>
        <Link href={ROUTES.login}>
          <Button>Đăng Nhập</Button>
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-white/70">Bạn không có quyền truy cập trang này.</p>
        <Link href={ROUTES.home}>
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
