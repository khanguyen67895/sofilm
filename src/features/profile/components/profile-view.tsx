"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export function ProfileView() {
  const { user, isAuthenticated, clearSession } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-white/70">Bạn cần đăng nhập để xem trang cá nhân.</p>
        <Link href={ROUTES.login}>
          <Button>Đăng Nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{user.name}</p>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>
      </div>

      <Button variant="outline" onClick={clearSession}>
        <LogOut size={16} /> Đăng Xuất
      </Button>
    </div>
  );
}
