"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/use-hydrated";

export function AdminHeader({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const mounted = useHydrated();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-black px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Mở menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white md:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-heading text-sm font-medium tracking-wide text-white/80 uppercase">
          Quản Trị
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {mounted && user && (
          <span className="hidden text-sm text-white/60 sm:block">{user.email ?? user.name}</span>
        )}
        <Button variant="outline" size="sm" onClick={clearSession}>
          <LogOut size={14} /> Đăng Xuất
        </Button>
      </div>
    </header>
  );
}
