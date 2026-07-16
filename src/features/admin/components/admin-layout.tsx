"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useUiStore } from "@/store/ui.store";
import { useHydrated } from "@/hooks/use-hydrated";
import { RouteFade } from "@/components/layout/route-fade";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const isAdminSidebarCollapsed = useUiStore((s) => s.isAdminSidebarCollapsed);
  const toggleAdminSidebar = useUiStore((s) => s.toggleAdminSidebar);
  const mounted = useHydrated();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // overflow-hidden here would break `position: sticky` on AdminSidebar/
    // AdminHeader below (an ancestor with overflow != visible redefines the
    // scroll container sticky positions against) — the two `fixed` background
    // layers don't need it, they're viewport-positioned regardless.
    <div className="relative flex min-h-screen bg-black">
      <Image
        src="/image/ic_bg_login.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none fixed inset-0 object-cover opacity-15"
      />
      <div className="pointer-events-none fixed inset-0 bg-black/50" />

      <AdminSidebar
        collapsed={mounted && isAdminSidebarCollapsed}
        onToggleCollapse={toggleAdminSidebar}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="relative flex min-h-screen flex-1 flex-col">
        <AdminHeader onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-8 sm:px-8">
          <RouteFade>{children}</RouteFade>
        </main>
      </div>
    </div>
  );
}
